// 星座帝国 - 主界面
import { _decorator, Component, Node, Label, Color, UITransform, Layers, Sprite, SpriteFrame, resources, sys } from 'cc';

const { ccclass, property } = _decorator;

// API配置
const API_BASE = 'http://localhost:3000/v1';

// 本地存储键名
const STORAGE_KEYS = {
    TOKEN: 'zodiac_token',
    USER: 'zodiac_user',
    SETTINGS: 'zodiac_settings'
};

@ccclass('TestScene')
export class TestScene extends Component {
    
    // 素材
    private iconGold: SpriteFrame | null = null;
    private iconDiamond: SpriteFrame | null = null;
    private iconTimecoin: SpriteFrame | null = null;
    private tabHome: SpriteFrame | null = null;
    private tabHomeActive: SpriteFrame | null = null;
    private tabGalaxy: SpriteFrame | null = null;
    private tabGalaxyActive: SpriteFrame | null = null;
    private tabBattle: SpriteFrame | null = null;
    private tabBattleActive: SpriteFrame | null = null;
    private tabMarket: SpriteFrame | null = null;
    private tabMarketActive: SpriteFrame | null = null;
    private tabProfile: SpriteFrame | null = null;
    private tabProfileActive: SpriteFrame | null = null;
    
    private currentPage: string = 'home';
    private contentNode: Node | null = null;
    
    // 用户数据和token
    private token: string = '';
    private userData: any = null;
    private emotionData: { emotionType: number, amount: number }[] = [];
    
    private emotionNames = ['喜悦', '激情', '平静', '智慧', '意志'];
    private emotionIcons = ['😊', '🔥', '🌊', '📚', '💪'];
    
    // ==================== 数据持久化 ====================
    
    saveToStorage(key: string, data: any) {
        try {
            if (sys.localStorage) {
                sys.localStorage.setItem(key, JSON.stringify(data));
            }
        } catch (e) {
            console.error('保存失败:', e);
        }
    }
    
    loadFromStorage(key: string): any {
        try {
            if (sys.localStorage) {
                const data = sys.localStorage.getItem(key);
                return data ? JSON.parse(data) : null;
            }
        } catch (e) {
            console.error('加载失败:', e);
        }
        return null;
    }
    
    clearStorage() {
        try {
            if (sys.localStorage) {
                sys.localStorage.removeItem(STORAGE_KEYS.TOKEN);
                sys.localStorage.removeItem(STORAGE_KEYS.USER);
            }
        } catch (e) {
            console.error('清除失败:', e);
        }
    }
    
    start() {
        console.log('🎮 星座帝国启动');
        
        // 尝试从本地存储恢复登录状态
        this.token = this.loadFromStorage(STORAGE_KEYS.TOKEN) || '';
        this.userData = this.loadFromStorage(STORAGE_KEYS.USER);
        
        if (this.token && this.userData) {
            console.log('✅ 已恢复登录状态:', this.userData.nickname);
            this.loadEmotionData();
        } else {
            this.loginAndLoad();
        }
    }
    
    async loginAndLoad() {
        try {
            const loginRes = await this.api('/auth/wechat/login', 'POST', { code: 'test' });
            if (loginRes.code === 0) {
                this.token = loginRes.data.access_token;
                this.userData = loginRes.data.user;
                
                // 保存到本地存储
                this.saveToStorage(STORAGE_KEYS.TOKEN, this.token);
                this.saveToStorage(STORAGE_KEYS.USER, this.userData);
                
                console.log('✅ 登录成功:', this.userData.nickname);
                this.loadEmotionData();
            }
        } catch (e) {
            console.error('登录失败:', e);
            // 使用默认数据
            this.userData = {
                nickname: '旅行者',
                level: 1,
                power: 100,
                gold: 1000,
                diamond: 50,
                timeCoin: 100
            };
        }
        
        this.loadAssets();
    }
    
    async loadEmotionData() {
        try {
            const res = await this.api('/emotion/resources');
            if (res.code === 0) {
                this.emotionData = res.data.map((e: any) => ({
                    emotionType: e.emotionType,
                    amount: parseInt(e.amount) || 0
                }));
                console.log('✅ 情绪资源加载成功');
            }
        } catch (e) {
            console.error('情绪资源加载失败:', e);
        }
        
        this.loadAssets();
    }
    
    async api(path: string, method: string = 'GET', body?: any): Promise<any> {
        const headers: any = { 'Content-Type': 'application/json' };
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }
        
        const res = await fetch(`${API_BASE}${path}`, {
            method,
            headers,
            body: body ? JSON.stringify(body) : undefined
        });
        
        return res.json();
    }
    
    loadAssets() {
        // 加载资源图标
        resources.load('icons/icon_gold/spriteFrame', SpriteFrame, (err, sf) => {
            if (!err) this.iconGold = sf;
        });
        resources.load('icons/icon_diamond/spriteFrame', SpriteFrame, (err, sf) => {
            if (!err) this.iconDiamond = sf;
        });
        resources.load('icons/icon_timecoin/spriteFrame', SpriteFrame, (err, sf) => {
            if (!err) this.iconTimecoin = sf;
        });
        
        // 加载Tab图标
        resources.load('tabs/tab_home/spriteFrame', SpriteFrame, (err, sf) => { if (!err) this.tabHome = sf; });
        resources.load('tabs/tab_home_active/spriteFrame', SpriteFrame, (err, sf) => { if (!err) this.tabHomeActive = sf; });
        resources.load('tabs/tab_galaxy/spriteFrame', SpriteFrame, (err, sf) => { if (!err) this.tabGalaxy = sf; });
        resources.load('tabs/tab_galaxy_active/spriteFrame', SpriteFrame, (err, sf) => { if (!err) this.tabGalaxyActive = sf; });
        resources.load('tabs/tab_battle/spriteFrame', SpriteFrame, (err, sf) => { if (!err) this.tabBattle = sf; });
        resources.load('tabs/tab_battle_active/spriteFrame', SpriteFrame, (err, sf) => { if (!err) this.tabBattleActive = sf; });
        resources.load('tabs/tab_market/spriteFrame', SpriteFrame, (err, sf) => { if (!err) this.tabMarket = sf; });
        resources.load('tabs/tab_market_active/spriteFrame', SpriteFrame, (err, sf) => { if (!err) this.tabMarketActive = sf; });
        resources.load('tabs/tab_profile/spriteFrame', SpriteFrame, (err, sf) => { if (!err) this.tabProfile = sf; });
        resources.load('tabs/tab_profile_active/spriteFrame', SpriteFrame, (err, sf) => { if (!err) this.tabProfileActive = sf; });
        
        // 创建UI
        this.createUI();
    }
    
    createUI() {
        // 内容容器
        this.contentNode = new Node('Content');
        this.contentNode.parent = this.node;
        this.contentNode.layer = Layers.Enum.UI_2D;
        this.contentNode.addComponent(UITransform).setContentSize(960, 560);
        this.contentNode.setPosition(0, 40, 0);
        
        this.showHome();
        this.createTabBar();
    }
    
    clearContent() {
        if (this.contentNode) {
            this.contentNode.destroyAllChildren();
        }
    }
    
    switchPage(page: string) {
        if (page === this.currentPage) return;
        this.currentPage = page;
        this.clearContent();
        
        if (page === 'home') this.showHome();
        else if (page === 'galaxy') this.showGalaxy();
        else if (page === 'battle') this.showBattle();
        else if (page === 'market') this.showMarket();
        else if (page === 'profile') this.showProfile();
        
        this.updateTabBar();
    }
    
    // ==================== 首页 ====================
    showHome() {
        const y = { top: 260, res: 190, content: 30, emotion: -80 };
        
        // 顶部标题区
        this.addBlock(0, y.top, 960, 80, new Color(20, 25, 45));
        this.addLabel('⭐ 星座帝国', -380, y.top, 32, new Color(255, 215, 0));
        
        // 用户卡片
        this.addBlock(280, y.top, 320, 70, new Color(40, 50, 80));
        this.addLabel('👤', 160, y.top + 5, 32, new Color(255, 255, 255));
        this.addLabel(this.userData.nickname || '旅行者', 230, y.top + 10, 22, new Color(255, 255, 255));
        this.addLabel(`Lv.${this.userData.level || 1}`, 230, y.top - 15, 16, new Color(255, 215, 0));
        
        // 资源栏
        this.addBlock(0, y.res, 960, 50, new Color(30, 35, 55));
        
        this.addIcon(-380, y.res, this.iconGold, '💰');
        this.addLabel(this.formatNum(this.userData.gold || 0), -340, y.res, 18, new Color(255, 215, 0));
        
        this.addIcon(-80, y.res, this.iconDiamond, '💎');
        this.addLabel(this.formatNum(this.userData.diamond || 0), -40, y.res, 18, new Color(100, 200, 255));
        
        this.addIcon(220, y.res, this.iconTimecoin, '⏰');
        this.addLabel(this.formatNum(this.userData.timeCoin || 0), 260, y.res, 18, new Color(100, 255, 200));
        
        // 主内容区
        this.addBlock(0, y.content, 960, 200, new Color(15, 20, 35));
        this.addLabel('欢迎来到星座的世界', 0, y.content + 70, 28, new Color(255, 255, 255));
        
        // 功能卡片
        this.addClickableCard(-220, y.content - 20, 180, 80, '🌌 银河探索', new Color(50, 60, 90), () => {
            this.switchPage('galaxy');
        });
        
        this.addClickableCard(220, y.content - 20, 180, 80, '⚔️ 星际战斗', new Color(80, 50, 60), () => {
            this.switchPage('battle');
        });
        
        // 抽卡入口
        this.addClickableCard(0, y.content - 110, 160, 50, '🎰 装备抽卡', new Color(100, 50, 100), () => {
            this.doGacha();
        });
        
        // 情绪资源区 - 情绪记录入口
        this.addLabel('💡 记录今日情绪', 0, y.emotion + 60, 18, new Color(255, 200, 100));
        
        const emotionTypes = [
            { type: 1, icon: '😊', name: '开心', color: new Color(255, 215, 0) },
            { type: 2, icon: '😤', name: '烦恼', color: new Color(150, 150, 200) },
            { type: 3, icon: '😢', name: '难过', color: new Color(100, 150, 255) },
            { type: 4, icon: '😡', name: '愤怒', color: new Color(255, 100, 100) },
            { type: 5, icon: '😰', name: '焦虑', color: new Color(200, 150, 255) },
        ];
        
        emotionTypes.forEach((e, i) => {
            const x = -280 + i * 140;
            this.addBlock(x, y.emotion, 80, 60, new Color(40, 50, 70));
            this.addLabel(e.icon, x - 15, y.emotion + 5, 18, new Color(255, 255, 255));
            this.addLabel(e.name, x + 15, y.emotion + 5, 11, new Color(200, 200, 200));
            
            // 记录按钮
            this.addClickableCard(x, y.emotion - 30, 60, 25, '记录', new Color(50, 80, 50), () => {
                this.showEmotionInput(e.type, e.name, e.icon);
            });
        });
    }
    
    // 显示情绪输入界面
    showEmotionInput(emotionType: number, emotionName: string, icon: string) {
        console.log('打开情绪记录:', emotionName);
        this.clearContent();
        
        this.addBlock(0, 0, 960, 560, new Color(20, 25, 45));
        
        // 标题栏
        this.addLabel(`${icon} 记录${emotionName}`, 0, 240, 32, new Color(255, 255, 255));
        
        // 返回按钮
        this.addClickableCard(-380, 240, 80, 40, '← 返回', new Color(60, 60, 80), () => {
            this.clearContent();
            this.showHome();
        });
        
        // 提示
        this.addLabel('分享你的心情，好友可见', 0, 190, 16, new Color(120, 120, 120));
        
        // 文字输入区
        this.addBlock(0, 80, 850, 180, new Color(30, 40, 60));
        this.addLabel('点击输入文字描述...', 0, 100, 18, new Color(80, 80, 80));
        this.addLabel('（最多500字）', 0, 40, 12, new Color(80, 80, 80));
        
        // 添加图片
        this.addClickableCard(-250, -60, 140, 45, '📷 添加图片', new Color(50, 60, 90), () => {
            console.log('选择图片');
        });
        
        // 添加视频
        this.addClickableCard(-70, -60, 140, 45, '🎥 添加视频', new Color(50, 60, 90), () => {
            console.log('选择视频');
        });
        
        // 位置
        this.addClickableCard(110, -60, 140, 45, '📍 添加位置', new Color(50, 60, 90), () => {
            console.log('选择位置');
        });
        
        // 可见范围
        this.addLabel('可见范围', -280, -130, 16, new Color(150, 150, 150));
        this.addClickableCard(150, -130, 160, 35, '👁 好友可见', new Color(40, 70, 50), () => {});
        
        // 发布按钮
        this.addClickableCard(0, -200, 200, 50, '✈️ 发布', new Color(70, 130, 70), () => {
            this.submitEmotionPost(emotionType, emotionName, icon);
        });
    }
    
    // 发布情绪动态
    async submitEmotionPost(emotionType: number, emotionName: string, icon: string) {
        if (!this.token) {
            console.log('请先登录');
            return;
        }
        
        console.log('发布情绪动态:', emotionName);
        
        try {
            // 调用后端API发布情绪卡片
            const res = await this.api('/emotion/cards', 'POST', {
                emotionType,
                title: `${icon} 今天${emotionName}`,
                content: '',  // 用户输入的内容
                mediaType: 0,  // 0=纯文字
                mediaUrl: '',
                visibility: 0  // 0=公开，1=好友可见
            });
            
            if (res.code === 0) {
                console.log('✅ 发布成功');
            } else {
                console.log('发布失败:', res.message);
            }
        } catch (e) {
            console.error('发布错误:', e);
        }
        
        this.clearContent();
        this.showHome();
    }
    
    // 加载好友动态
    async loadFriendFeed() {
        if (!this.token) return [];
        
        try {
            const res = await this.api('/emotion/cards?page=1&limit=10&orderBy=time');
            if (res.code === 0) {
                return res.data.list || [];
            }
        } catch (e) {
            console.error('加载动态失败:', e);
        }
        return [];
    }
    
    // 抽卡功能
    async doGacha() {
        if (!this.token) {
            console.log('请先登录');
            return;
        }
        
        console.log('🎰 开始抽卡...');
        
        try {
            const res = await this.api('/equipment/gacha', 'POST', { count: 1 });
            if (res.code === 0 && res.data) {
                console.log('✅ 抽卡成功:', res.data);
                // 显示抽卡结果
                this.showGachaResult(res.data);
                // 刷新用户数据
                await this.refreshUserData();
            } else {
                console.log('抽卡失败:', res.message);
            }
        } catch (e) {
            console.error('抽卡错误:', e);
        }
    }
    
    showGachaResult(equipments: any[]) {
        // 简单的结果显示
        if (equipments && equipments.length > 0) {
            const eq = equipments[0];
            const rarityColors: any = {
                1: new Color(200, 200, 200),
                2: new Color(100, 200, 255),
                3: new Color(200, 100, 255),
                4: new Color(255, 180, 0)
            };
            console.log(`🎉 获得: ${eq.name} (${['普通', '稀有', '史诗', '传说'][eq.rarity - 1]})`);
        }
    }
    
    async refreshUserData() {
        try {
            const res = await this.api('/users/me');
            if (res.code === 0) {
                this.userData = res.data;
                // 持久化保存
                this.saveToStorage(STORAGE_KEYS.USER, this.userData);
                this.clearContent();
                this.showHome();
            }
        } catch (e) {
            console.error('刷新用户数据失败:', e);
        }
    }
    
    // ==================== 其他页面 ====================
    showGalaxy() {
        this.addBlock(0, 0, 960, 560, new Color(20, 30, 50));
        this.addLabel('🌌 银河探索', 0, 240, 36, new Color(100, 200, 255));
        this.addLabel('我的银河', -380, 200, 24, new Color(255, 215, 0));
        
        ['银河一号', '银河二号', '银河三号'].forEach((n, i) => {
            const x = -300 + i * 300;
            this.addBlock(x, 0, 250, 180, new Color(40, 50, 80));
            this.addLabel(n, x, 50, 24, new Color(255, 255, 255));
            this.addLabel(`Lv.${i + 1}`, x, 10, 18, new Color(255, 215, 0));
        });
        
        this.addLabel('🔍 探索新星域', 0, -180, 28, new Color(100, 200, 255));
    }
    
    showBattle() {
        this.addBlock(0, 0, 960, 560, new Color(50, 20, 30));
        this.addLabel('⚔️ 星际战斗', 0, 240, 36, new Color(255, 100, 100));
        this.addLabel('选择战斗模式', 0, 180, 24, new Color(255, 255, 255));
        
        // 快速对战
        this.addClickableCard(-300, 0, 250, 180, '⚡快速对战', new Color(60, 40, 50), () => {
            this.startBattle('quick');
        });
        this.addLabel('随机匹配对手', -300, -60, 14, new Color(150, 150, 150));
        
        // 排位赛
        this.addClickableCard(0, 0, 250, 180, '🏆排位赛', new Color(60, 50, 40), () => {
            this.startBattle('rank');
        });
        this.addLabel('冲击更高排名', 0, -60, 14, new Color(150, 150, 150));
        
        // 团队战
        this.addClickableCard(300, 0, 250, 180, '👥团队战', new Color(40, 50, 60), () => {
            this.startBattle('team');
        });
        this.addLabel('与队友并肩作战', 300, -60, 14, new Color(150, 150, 150));
        
        this.addLabel('━━━━ 战绩 ━━━━', 0, -140, 16, new Color(100, 100, 100));
        this.addLabel('胜: 0  负: 0', 0, -170, 20, new Color(255, 255, 255));
        
        // 加载战绩
        this.loadBattleHistory();
    }
    
    async loadBattleHistory() {
        try {
            const res = await this.api('/battle/history');
            if (res.code === 0) {
                let wins = 0, losses = 0;
                res.data.forEach((b: any) => {
                    if (b.result === 'win') wins++;
                    else losses++;
                });
                console.log(`战绩: ${wins}胜 ${losses}负`);
            }
        } catch (e) {
            console.error('加载战绩失败:', e);
        }
    }
    
    async startBattle(type: string) {
        if (!this.token) return;
        
        console.log('开始战斗:', type);
        
        try {
            const res = await this.api('/battle/start', 'POST', { 
                battleType: type,
                opponentId: Math.floor(Math.random() * 10) + 1  // 随机对手
            });
            
            if (res.code === 0) {
                console.log('战斗结果:', res.data);
                this.showBattleResult(res.data);
            } else {
                console.log('战斗失败:', res.message);
            }
        } catch (e) {
            console.error('战斗错误:', e);
        }
    }
    
    showBattleResult(result: any) {
        console.log(`战斗${result?.result === 'win' ? '胜利！🎉' : '失败...💔'}`);
    }
    
    showMarket() {
        this.addBlock(0, 0, 960, 560, new Color(20, 40, 40));
        this.addLabel('🏪 星际市场', 0, 240, 36, new Color(100, 255, 200));
        
        // 分类标签
        const tabs = ['全部', '装备', '资源', '道具'];
        tabs.forEach((t, i) => {
            const x = -300 + i * 150;
            const active = i === 0;
            this.addBlock(x, 180, 120, 40, active ? new Color(60, 100, 100) : new Color(40, 60, 60));
            this.addLabel(t, x, 180, 18, active ? new Color(100, 255, 200) : new Color(150, 150, 150));
        });
        
        // 示例商品
        const items = [
            { name: '⚡ 星辰之剑', price: 5000, rarity: '稀有' },
            { name: '🛡️ 银河护盾', price: 3000, rarity: '稀有' },
            { name: '💎 时间水晶x100', price: 1000, rarity: '普通' },
            { name: '🔥 烈焰核心', price: 8000, rarity: '史诗' },
        ];
        
        items.forEach((item, i) => {
            const y = 100 - i * 80;
            this.addBlock(0, y, 880, 65, new Color(40, 60, 60));
            this.addLabel(item.name, -350, y + 8, 20, new Color(255, 255, 255));
            this.addLabel(`💰 ${item.price}`, 200, y + 8, 18, new Color(255, 215, 0));
            this.addClickableCard(350, y, 60, 40, '购买', new Color(50, 80, 50), () => this.buyItem(item));
        });
    }
    
    buyItem(item: any) {
        console.log('购买:', item.name, '价格:', item.price);
        // TODO: 实现购买逻辑
    }
    
    showProfile() {
        this.addBlock(0, 0, 960, 560, new Color(20, 25, 40));
        this.addLabel('👤', 0, 180, 80, new Color(255, 255, 255));
        this.addLabel(this.userData?.nickname || '旅行者', 0, 60, 32, new Color(255, 255, 255));
        this.addLabel(`Lv.${this.userData?.level || 1}`, 0, -10, 24, new Color(255, 215, 0));
        
        this.addBlock(0, -100, 400, 80, new Color(30, 40, 60));
        this.addLabel(`战力: ${this.userData?.power || 100}`, 0, -100, 22, new Color(255, 100, 100));
        
        // 菜单项
        const menuItems = [
            { icon: '🎒', name: '我的装备', action: () => this.showMyEquipment() },
            { icon: '💬', name: '好友动态', action: () => this.showFriendFeed() },
            { icon: '⏰', name: '时空银行', action: () => this.showTimeBank() },
            { icon: '🏅', name: '成就系统', action: () => {} },
            { icon: '⚙️', name: '游戏设置', action: () => {} },
        ];
        
        menuItems.forEach((item, i) => {
            const y = -200 - i * 55;
            this.addClickableCard(0, y, 800, 45, `${item.icon}  ${item.name}`, new Color(35, 45, 65), item.action);
        });
    }
    
    // 显示我的装备
    showMyEquipment() {
        console.log('查看我的装备');
        this.clearContent();
        
        this.addBlock(0, 0, 960, 560, new Color(20, 25, 40));
        this.addLabel('🎒 我的装备', 0, 240, 32, new Color(255, 255, 255));
        
        // 返回按钮
        this.addClickableCard(-380, 240, 80, 40, '← 返回', new Color(60, 60, 80), () => {
            this.clearContent();
            this.showProfile();
        });
        
        // 装备列表
        this.addLabel('暂无装备，快去抽卡吧！', 0, 0, 20, new Color(100, 100, 100));
    }
    
    // 显示时空银行
    async showTimeBank() {
        console.log('查看时空银行');
        this.clearContent();
        
        this.addBlock(0, 0, 960, 560, new Color(15, 25, 45));
        this.addLabel('⏰ 时空银行', 0, 240, 36, new Color(100, 200, 255));
        
        // 返回按钮
        this.addClickableCard(-380, 240, 80, 40, '← 返回', new Color(60, 60, 80), () => {
            this.clearContent();
            this.showProfile();
        });
        
        // 余额显示
        this.addBlock(0, 140, 600, 100, new Color(30, 45, 70));
        this.addLabel('银行余额', 0, 175, 18, new Color(150, 180, 200));
        this.addLabel(`${this.userData?.bankedTimeCoin || 0}`, 0, 130, 42, new Color(100, 255, 200));
        
        // 存取按钮
        this.addClickableCard(-150, 20, 140, 50, '📥 存入', new Color(50, 90, 70), () => {
            this.showDepositUI();
        });
        
        this.addClickableCard(150, 20, 140, 50, '📤 取出', new Color(90, 70, 50), () => {
            this.showWithdrawUI();
        });
        
        // 利息说明
        this.addLabel('━━━━ 利息说明 ━━━━', 0, -60, 16, new Color(80, 80, 80));
        this.addLabel('日利率: 0.1%', 0, -100, 18, new Color(150, 150, 150));
        this.addLabel('存入1000时空晶体，每日获得1个利息', 0, -130, 14, new Color(100, 100, 100));
        
        // 挂机收益
        this.addLabel('━━━━ 在线挂机 ━━━━', 0, -180, 16, new Color(80, 80, 80));
        this.addLabel('在线每满1小时 = 1时空晶体', 0, -210, 18, new Color(100, 200, 255));
        this.addLabel('当前在线: 0分钟', 0, -240, 16, new Color(150, 150, 150));
    }
    
    showDepositUI() {
        this.clearContent();
        
        this.addBlock(0, 0, 960, 560, new Color(15, 25, 45));
        this.addLabel('📥 存入时空银行', 0, 240, 32, new Color(100, 255, 200));
        
        this.addClickableCard(-380, 240, 80, 40, '← 返回', new Color(60, 60, 80), () => {
            this.showTimeBank();
        });
        
        // 输入金额
        this.addBlock(0, 100, 400, 60, new Color(30, 45, 70));
        this.addLabel('输入存入数量', 0, 100, 18, new Color(200, 200, 200));
        
        // 快捷金额
        this.addClickableCard(-200, 0, 80, 40, '10', new Color(40, 60, 90), () => {});
        this.addClickableCard(-50, 0, 80, 40, '50', new Color(40, 60, 90), () => {});
        this.addClickableCard(100, 0, 80, 40, '100', new Color(40, 60, 90), () => {});
        this.addClickableCard(250, 0, 80, 40, '全部', new Color(60, 80, 100), () => {});
        
        // 确认按钮
        this.addClickableCard(0, -100, 180, 50, '✅ 确认存入', new Color(50, 100, 70), () => {
            this.depositTimeCoin(10);
        });
    }
    
    showWithdrawUI() {
        this.clearContent();
        
        this.addBlock(0, 0, 960, 560, new Color(15, 25, 45));
        this.addLabel('📤 从银行取出', 0, 240, 32, new Color(255, 200, 100));
        
        this.addClickableCard(-380, 240, 80, 40, '← 返回', new Color(60, 60, 80), () => {
            this.showTimeBank();
        });
        
        // 余额
        this.addLabel(`银行余额: ${this.userData?.bankedTimeCoin || 0}`, 0, 150, 24, new Color(100, 200, 255));
        
        // 输入金额
        this.addBlock(0, 60, 400, 60, new Color(30, 45, 70));
        this.addLabel('输入取出数量', 0, 60, 18, new Color(200, 200, 200));
        
        // 快捷金额
        this.addClickableCard(-200, -30, 80, 40, '10', new Color(40, 60, 90), () => {});
        this.addClickableCard(-50, -30, 80, 40, '50', new Color(40, 60, 90), () => {});
        this.addClickableCard(100, -30, 80, 40, '100', new Color(40, 60, 90), () => {});
        this.addClickableCard(250, -30, 80, 40, '全部', new Color(60, 80, 100), () => {});
        
        // 确认按钮
        this.addClickableCard(0, -120, 180, 50, '✅ 确认取出', new Color(100, 80, 50), () => {
            this.withdrawTimeCoin(10);
        });
    }
    
    async depositTimeCoin(amount: number) {
        if (!this.token) return;
        
        try {
            const res = await this.api('/users/bank/deposit', 'POST', { amount });
            if (res.code === 0) {
                console.log('✅ 存入成功');
                this.userData.timeCoin = res.data.timeCoin;
                this.userData.bankedTimeCoin = res.data.bankedTimeCoin;
                this.saveToStorage(STORAGE_KEYS.USER, this.userData);
                this.showTimeBank();
            } else {
                console.log('存入失败:', res.message);
            }
        } catch (e) {
            console.error('存入错误:', e);
        }
    }
    
    async withdrawTimeCoin(amount: number) {
        if (!this.token) return;
        
        try {
            const res = await this.api('/users/bank/withdraw', 'POST', { amount });
            if (res.code === 0) {
                console.log('✅ 取出成功');
                this.userData.timeCoin = res.data.timeCoin;
                this.userData.bankedTimeCoin = res.data.bankedTimeCoin;
                this.saveToStorage(STORAGE_KEYS.USER, this.userData);
                this.showTimeBank();
            } else {
                console.log('取出失败:', res.message);
            }
        } catch (e) {
            console.error('取出错误:', e);
        }
    }
    
    // 显示好友动态流
    showFriendFeed() {
        console.log('查看好友动态');
        this.clearContent();
        
        this.addBlock(0, 0, 960, 560, new Color(20, 25, 40));
        this.addLabel('💬 好友动态', 0, 240, 32, new Color(255, 255, 255));
        
        // 返回按钮
        this.addClickableCard(-380, 240, 80, 40, '← 返回', new Color(60, 60, 80), () => {
            this.clearContent();
            this.showProfile();
        });
        
        // 模拟动态数据
        const feeds = [
            { user: '星河旅人', emotion: '😊 开心', content: '今天收到了惊喜礼物！', time: '3分钟前', likes: 12 },
            { user: '银河战士', emotion: '😤 烦恼', content: '加班到很晚...', time: '15分钟前', likes: 5 },
            { user: '星际商人', emotion: '😊 开心', content: '今天交易赚了不少！', time: '1小时前', likes: 23 },
        ];
        
        feeds.forEach((feed, i) => {
            const y = 160 - i * 120;
            
            // 动态卡片
            this.addBlock(0, y, 880, 100, new Color(30, 40, 60));
            
            // 用户名
            this.addLabel(feed.user, -350, y + 25, 18, new Color(255, 255, 255));
            
            // 情绪标签
            this.addLabel(feed.emotion, -200, y + 25, 14, new Color(255, 215, 0));
            
            // 内容
            this.addLabel(feed.content, 0, y - 5, 16, new Color(200, 200, 200));
            
            // 时间和点赞
            this.addLabel(feed.time, -350, y - 30, 12, new Color(100, 100, 100));
            this.addLabel(`❤️ ${feed.likes}`, 300, y - 30, 14, new Color(255, 100, 150));
        });
    }
    
    showProfile() {
        this.addBlock(0, 0, 960, 560, new Color(20, 25, 40));
        this.addLabel('👤', 0, 180, 80, new Color(255, 255, 255));
        this.addLabel(this.userData.nickname, 0, 60, 32, new Color(255, 255, 255));
        this.addLabel(`Lv.${this.userData.level}`, 0, -10, 24, new Color(255, 215, 0));
        
        this.addBlock(0, -100, 400, 80, new Color(30, 40, 60));
        this.addLabel(`战力: ${this.userData.power}`, 0, -100, 22, new Color(255, 100, 100));
        
        ['🎒我的装备', '🏅成就系统', '⚙️游戏设置'].forEach((n, i) => {
            const y = -200 - i * 60;
            this.addBlock(0, y, 800, 50, new Color(35, 45, 65));
            this.addLabel(n, 0, y, 18, new Color(255, 255, 255));
        });
    }
    
    // ==================== TabBar ====================
    createTabBar() {
        const tabBar = new Node('TabBar');
        tabBar.parent = this.node;
        tabBar.setPosition(0, -300, 0);
        tabBar.layer = Layers.Enum.UI_2D;
        tabBar.addComponent(UITransform).setContentSize(960, 80);
        
        // 背景
        const bg = new Node('BG');
        bg.parent = tabBar;
        bg.setPosition(0, 0, 0);
        bg.layer = Layers.Enum.UI_2D;
        bg.addComponent(UITransform).setContentSize(960, 80);
        const bgLabel = bg.addComponent(Label);
        bgLabel.string = '█'.repeat(48);
        bgLabel.fontSize = 80;
        bgLabel.lineHeight = 80;
        bgLabel.color = new Color(25, 30, 50);
        bgLabel.horizontalAlign = Label.HorizontalAlign.CENTER;
        
        const tabs = [
            { id: 'home', icon: '🏠', name: '首页' },
            { id: 'galaxy', icon: '🌌', name: '银河' },
            { id: 'battle', icon: '⚔️', name: '战斗' },
            { id: 'market', icon: '🏪', name: '市场' },
            { id: 'profile', icon: '👤', name: '我的' },
        ];
        
        const tabSprites: any = {
            home: { normal: this.tabHome, active: this.tabHomeActive },
            galaxy: { normal: this.tabGalaxy, active: this.tabGalaxyActive },
            battle: { normal: this.tabBattle, active: this.tabBattleActive },
            market: { normal: this.tabMarket, active: this.tabMarketActive },
            profile: { normal: this.tabProfile, active: this.tabProfileActive },
        };
        
        tabs.forEach((t, i) => {
            const x = -320 + i * 160;
            const active = t.id === this.currentPage;
            const color = active ? new Color(255, 215, 0) : new Color(150, 150, 150);
            
            // 图标
            const iconNode = new Node('Icon_' + t.id);
            iconNode.parent = tabBar;
            iconNode.setPosition(x, 15, 0);
            iconNode.layer = Layers.Enum.UI_2D;
            iconNode.addComponent(UITransform).setContentSize(40, 40);
            
            const sprites = tabSprites[t.id];
            if (sprites && (active ? sprites.active : sprites.normal)) {
                const sprite = iconNode.addComponent(Sprite);
                sprite.spriteFrame = active ? sprites.active : sprites.normal;
                sprite.sizeMode = Sprite.SizeMode.CUSTOM;
            } else {
                const iconLabel = iconNode.addComponent(Label);
                iconLabel.string = t.icon;
                iconLabel.fontSize = 28;
                iconLabel.lineHeight = 32;
                iconLabel.color = color;
                iconLabel.horizontalAlign = Label.HorizontalAlign.CENTER;
            }
            
            // 名称
            const nameNode = new Node('Name_' + t.id);
            nameNode.parent = tabBar;
            nameNode.setPosition(x, -15, 0);
            nameNode.layer = Layers.Enum.UI_2D;
            nameNode.addComponent(UITransform).setContentSize(100, 20);
            const nameLabel = nameNode.addComponent(Label);
            nameLabel.string = t.name;
            nameLabel.fontSize = 16;
            nameLabel.lineHeight = 20;
            nameLabel.color = color;
            nameLabel.horizontalAlign = Label.HorizontalAlign.CENTER;
            
            // 点击区域
            const clickNode = new Node('Click');
            clickNode.parent = tabBar;
            clickNode.setPosition(x, 0, 0);
            clickNode.layer = Layers.Enum.UI_2D;
            clickNode.addComponent(UITransform).setContentSize(140, 70);
            clickNode.on(Node.EventType.TOUCH_END, () => this.switchPage(t.id));
        });
    }
    
    updateTabBar() {
        const tabBar = this.node.getChildByName('TabBar');
        if (!tabBar) return;
        
        const tabs = ['home', 'galaxy', 'battle', 'market', 'profile'];
        
        tabs.forEach(tabId => {
            const iconNode = tabBar.getChildByName('Icon_' + tabId);
            const nameNode = tabBar.getChildByName('Name_' + tabId);
            const active = tabId === this.currentPage;
            const color = active ? new Color(255, 215, 0) : new Color(150, 150, 150);
            
            if (iconNode) {
                const label = iconNode.getComponent(Label);
                if (label) label.color = color;
            }
            if (nameNode) {
                const label = nameNode.getComponent(Label);
                if (label) label.color = color;
            }
        });
    }
    
    // ==================== 辅助方法 ====================
    addLabel(text: string, x: number, y: number, fontSize: number, color: Color) {
        if (!this.contentNode) return;
        
        const node = new Node('Label');
        node.parent = this.contentNode;
        node.setPosition(x, y, 0);
        node.layer = Layers.Enum.UI_2D;
        node.addComponent(UITransform).setContentSize(500, fontSize + 8);
        
        const label = node.addComponent(Label);
        label.string = text;
        label.fontSize = fontSize;
        label.lineHeight = fontSize + 4;
        label.color = color;
        label.horizontalAlign = Label.HorizontalAlign.CENTER;
    }
    
    addBlock(x: number, y: number, width: number, height: number, color: Color) {
        if (!this.contentNode) return;
        
        const node = new Node('Block');
        node.parent = this.contentNode;
        node.setPosition(x, y, 0);
        node.layer = Layers.Enum.UI_2D;
        node.addComponent(UITransform).setContentSize(width, height);
        
        const label = node.addComponent(Label);
        label.string = '█'.repeat(Math.floor(width / 20));
        label.fontSize = height;
        label.lineHeight = height;
        label.color = color;
        label.horizontalAlign = Label.HorizontalAlign.CENTER;
    }
    
    addIcon(x: number, y: number, spriteFrame: SpriteFrame | null, defaultEmoji: string) {
        if (!this.contentNode) return;
        
        const node = new Node('Icon');
        node.parent = this.contentNode;
        node.setPosition(x, y, 0);
        node.layer = Layers.Enum.UI_2D;
        node.addComponent(UITransform).setContentSize(28, 28);
        
        if (spriteFrame) {
            const sprite = node.addComponent(Sprite);
            sprite.spriteFrame = spriteFrame;
            sprite.sizeMode = Sprite.SizeMode.CUSTOM;
        } else {
            const label = node.addComponent(Label);
            label.string = defaultEmoji;
            label.fontSize = 20;
            label.color = new Color(255, 255, 255);
        }
    }
    
    // 添加可点击的卡片
    addClickableCard(x: number, y: number, width: number, height: number, text: string, color: Color, onClick: () => void) {
        if (!this.contentNode) return;
        
        const node = new Node('Card');
        node.parent = this.contentNode;
        node.setPosition(x, y, 0);
        node.layer = Layers.Enum.UI_2D;
        node.addComponent(UITransform).setContentSize(width, height);
        
        // 背景
        const bgLabel = node.addComponent(Label);
        bgLabel.string = '█'.repeat(Math.floor(width / 20));
        bgLabel.fontSize = height;
        bgLabel.lineHeight = height;
        bgLabel.color = color;
        bgLabel.horizontalAlign = Label.HorizontalAlign.CENTER;
        
        // 文字
        const labelNode = new Node('Text');
        labelNode.parent = node;
        labelNode.setPosition(0, 0, 0);
        labelNode.layer = Layers.Enum.UI_2D;
        labelNode.addComponent(UITransform).setContentSize(width, 30);
        const label = labelNode.addComponent(Label);
        label.string = text;
        label.fontSize = 20;
        label.lineHeight = 24;
        label.color = new Color(255, 255, 255);
        label.horizontalAlign = Label.HorizontalAlign.CENTER;
        
        // 点击事件
        node.on(Node.EventType.TOUCH_END, onClick);
    }
    
    formatNum(n: number): string {
        if (n >= 10000) return (n / 10000).toFixed(1) + 'w';
        return n.toLocaleString();
    }
}