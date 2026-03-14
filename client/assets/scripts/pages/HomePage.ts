// 首页 - 主界面
import { _decorator, Component, Node, Label, Color, UITransform, Layers, Sprite, SpriteFrame, resources, Button } from 'cc';
import { GameManager, PageType } from '../GameManager';
import { api } from '../managers/ApiClient';

const { ccclass, property } = _decorator;

@ccclass('HomePage')
export class HomePage extends Component {
    
    @property({ type: SpriteFrame })
    bgCardSprite: SpriteFrame | null = null;
    
    start() {
        this.createUI();
    }
    
    createUI() {
        const game = GameManager.instance;
        const user = game?.userData;
        if (!user) return;
        
        // === 顶部区域 ===
        this.addColorBlock(0, 280, 960, 120, new Color(20, 25, 45, 230));
        
        // Logo
        this.addLabel('⭐ 星座帝国', -350, 300, 36, new Color(255, 215, 0));
        
        // 用户卡片
        this.createUserCard();
        
        // === 资源栏 ===
        this.createResourceBar(user);
        
        // === 主内容区 ===
        this.addColorBlock(0, 0, 960, 360, new Color(15, 20, 35, 180));
        
        // 欢迎语
        this.addLabel('欢迎来到星座的世界', 0, 120, 32, new Color(255, 255, 255));
        
        // 功能入口
        this.createFeatureCards();
        
        // === 情绪资源区 ===
        this.addLabel('💡 每日情绪资源', 0, -60, 20, new Color(255, 200, 100));
        this.createEmotionCards();
    }
    
    createUserCard() {
        const user = GameManager.instance?.userData;
        if (!user) return;
        
        // 卡片背景
        this.addColorBlock(200, 280, 300, 100, new Color(40, 50, 80, 200));
        
        // 头像
        this.addLabel('👤', 100, 295, 40, new Color(255, 255, 255));
        
        // 信息
        this.addLabel(user.nickname, 180, 310, 24, new Color(255, 255, 255));
        this.addLabel(`Lv.${user.level}  战力: ${user.power}`, 180, 270, 18, new Color(255, 215, 0));
        this.addLabel(user.zodiacName, 180, 250, 14, new Color(150, 180, 255));
    }
    
    createResourceBar(user: any) {
        this.addColorBlock(0, 200, 960, 60, new Color(30, 35, 55, 220));
        
        // 金币
        this.addLabel('💰', -300, 200, 24, new Color(255, 255, 255));
        this.addLabel(this.formatNum(user.gold), -250, 200, 22, new Color(255, 215, 0));
        
        // 钻石
        this.addLabel('💎', -50, 200, 24, new Color(255, 255, 255));
        this.addLabel(this.formatNum(user.diamond), 0, 200, 22, new Color(100, 200, 255));
        
        // 时间币
        this.addLabel('⏰', 200, 200, 24, new Color(255, 255, 255));
        this.addLabel(this.formatNum(user.timeCoin), 250, 200, 22, new Color(100, 255, 200));
    }
    
    createFeatureCards() {
        // 银河探索
        this.addColorBlock(-200, 20, 200, 100, new Color(50, 60, 90, 220));
        this.addLabel('🌌 银河探索', -200, 35, 22, new Color(255, 255, 255));
        this.addLabel('探索未知星域', -200, 0, 16, new Color(180, 180, 180));
        
        // 星际战斗
        this.addColorBlock(200, 20, 200, 100, new Color(80, 50, 60, 220));
        this.addLabel('⚔️ 星际战斗', 200, 35, 22, new Color(255, 255, 255));
        this.addLabel('挑战其他玩家', 200, 0, 16, new Color(180, 180, 180));
    }
    
    createEmotionCards() {
        const emotions = GameManager.instance?.emotionData || [];
        const config = [
            { type: 1, icon: '😊', name: '喜悦', color: new Color(255, 200, 100) },
            { type: 2, icon: '🔥', name: '激情', color: new Color(255, 100, 100) },
            { type: 3, icon: '🌊', name: '平静', color: new Color(100, 200, 255) },
            { type: 4, icon: '📚', name: '智慧', color: new Color(200, 150, 255) },
            { type: 5, icon: '💪', name: '意志', color: new Color(150, 255, 150) },
        ];
        
        config.forEach((e, i) => {
            const x = -270 + i * 135;
            const data = emotions.find((d: any) => d.emotionType === e.type);
            const amount = data?.amount || 0;
            
            // 卡片
            this.addColorBlock(x, -140, 120, 70, new Color(40, 50, 70, 200));
            
            // 图标和名称
            this.addLabel(e.icon, x - 30, -130, 24, new Color(255, 255, 255));
            this.addLabel(e.name, x + 20, -130, 14, e.color);
            
            // 数量
            this.addLabel(this.formatNum(amount), x, -155, 16, new Color(200, 200, 200));
            
            // 收取按钮
            this.addCollectButton(x, -180, e.type);
        });
    }
    
    addCollectButton(x: number, y: number, emotionType: number) {
        const node = new Node('Btn_Collect_' + emotionType);
        node.parent = this.node;
        node.setPosition(x, y, 0);
        node.layer = Layers.Enum.UI_2D;
        
        const uiTransform = node.addComponent(UITransform);
        uiTransform.setContentSize(80, 28);
        
        const label = node.addComponent(Label);
        label.string = '收取';
        label.fontSize = 14;
        label.color = new Color(100, 255, 100);
        label.horizontalAlign = Label.HorizontalAlign.CENTER;
        
        // 简单的点击效果
        node.on(Node.EventType.TOUCH_END, async () => {
            console.log('收取情绪:', emotionType);
            try {
                const result = await api.collectEmotion(emotionType);
                console.log('收取成功:', result);
                // 刷新数据
                await GameManager.instance?.refreshUserData();
            } catch (e: any) {
                console.error('收取失败:', e);
                const msg = e?.response?.data?.message || e?.message || '收取失败';
                this.showToast(msg);
            }
        });
    }
    
    // 辅助方法
    addLabel(text: string, x: number, y: number, fontSize: number, color: Color) {
        const node = new Node('Label');
        node.parent = this.node;
        node.setPosition(x, y, 0);
        node.layer = Layers.Enum.UI_2D;
        
        const uiTransform = node.addComponent(UITransform);
        uiTransform.setContentSize(600, fontSize + 10);
        
        const label = node.addComponent(Label);
        label.string = text;
        label.fontSize = fontSize;
        label.lineHeight = fontSize + 4;
        label.color = color;
        label.horizontalAlign = Label.HorizontalAlign.CENTER;
    }
    
    addColorBlock(x: number, y: number, width: number, height: number, color: Color) {
        const node = new Node('Block');
        node.parent = this.node;
        node.setPosition(x, y, 0);
        node.layer = Layers.Enum.UI_2D;
        
        const uiTransform = node.addComponent(UITransform);
        uiTransform.setContentSize(width, height);
        
        const label = node.addComponent(Label);
        label.string = '█'.repeat(Math.floor(width / 20));
        label.fontSize = height;
        label.lineHeight = height;
        label.color = color;
        label.horizontalAlign = Label.HorizontalAlign.CENTER;
    }
    
    formatNum(num: number): string {
        if (num >= 10000) return (num / 10000).toFixed(1) + 'w';
        return num.toLocaleString();
    }
}