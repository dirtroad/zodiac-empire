// 个人中心页
import { _decorator, Component, Node, Label, Color, UITransform, Layers } from 'cc';
import { GameManager } from '../GameManager';

const { ccclass, property } = _decorator;

@ccclass('ProfilePage')
export class ProfilePage extends Component {
    
    start() {
        this.createUI();
    }
    
    createUI() {
        const user = GameManager.instance?.userData;
        
        // 背景
        this.addColorBlock(0, 0, 960, 640, new Color(20, 25, 40, 230));
        
        // 头像区域
        this.addColorBlock(0, 200, 200, 200, new Color(40, 50, 70, 200));
        this.addLabel('👤', 0, 220, 80, new Color(255, 255, 255));
        
        // 用户名
        this.addLabel(user?.nickname || '旅行者', 0, 100, 32, new Color(255, 255, 255));
        
        // 星座
        this.addLabel(user?.zodiacName || '白羊座', 0, 60, 20, new Color(150, 180, 255));
        
        // 等级信息
        this.addLabel(`Lv.${user?.level || 1}`, 0, 20, 24, new Color(255, 215, 0));
        
        // 属性面板
        this.createStatPanel();
        
        // 功能菜单
        this.createMenuItems();
    }
    
    createStatPanel() {
        const user = GameManager.instance?.userData;
        
        // 属性背景
        this.addColorBlock(0, -80, 400, 120, new Color(30, 40, 60, 200));
        
        // 战力
        this.addLabel('⚔️ 战力', -120, -50, 18, new Color(150, 150, 150));
        this.addLabel(this.formatNum(user?.power || 100), -120, -80, 28, new Color(255, 100, 100));
        
        // 金币
        this.addLabel('💰 金币', 0, -50, 18, new Color(150, 150, 150));
        this.addLabel(this.formatNum(user?.gold || 1000), 0, -80, 28, new Color(255, 215, 0));
        
        // 钻石
        this.addLabel('💎 钻石', 120, -50, 18, new Color(150, 150, 150));
        this.addLabel(this.formatNum(user?.diamond || 50), 120, -80, 28, new Color(100, 200, 255));
    }
    
    createMenuItems() {
        const items = [
            { icon: '🎒', name: '我的装备', desc: '查看已获得的装备' },
            { icon: '🏅', name: '成就系统', desc: '查看成就和奖励' },
            { icon: '⚙️', name: '游戏设置', desc: '音效、通知等设置' },
            { icon: '📞', name: '联系客服', desc: '问题反馈与帮助' },
        ];
        
        items.forEach((item, i) => {
            const y = -180 - i * 70;
            
            // 菜单项背景
            this.addColorBlock(0, y, 800, 60, new Color(35, 45, 65, 200));
            
            // 图标
            this.addLabel(item.icon, -350, y, 28, new Color(255, 255, 255));
            
            // 名称
            this.addLabel(item.name, -250, y + 8, 20, new Color(255, 255, 255));
            
            // 描述
            this.addLabel(item.desc, -250, y - 15, 14, new Color(150, 150, 150));
            
            // 箭头
            this.addLabel('›', 350, y, 24, new Color(100, 100, 100));
        });
    }
    
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