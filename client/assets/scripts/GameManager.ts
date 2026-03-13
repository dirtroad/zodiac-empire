// 星座帝国 - 游戏管理器
import { _decorator, Component, Node, Prefab, instantiate, resources, director } from 'cc';
import { api, gameState } from './managers/ApiClient';

const { ccclass, property } = _decorator;

// 页面类型
export type PageType = 'home' | 'galaxy' | 'battle' | 'market' | 'profile';

// 游戏管理器 - 单例
@ccclass('GameManager')
export class GameManager extends Component {
    
    private static _instance: GameManager | null = null;
    
    static get instance(): GameManager {
        return GameManager._instance!;
    }
    
    @property(Node)
    pageContainer: Node | null = null;
    
    private _currentPage: PageType = 'home';
    private _pages: Map<PageType, Node> = new Map();
    
    // 用户数据
    private _userData: any = null;
    private _emotionData: any[] = [];
    
    get userData() { return this._userData; }
    get emotionData() { return this._emotionData; }
    get currentPage() { return this._currentPage; }
    
    onLoad() {
        if (GameManager._instance) {
            this.destroy();
            return;
        }
        GameManager._instance = this;
        
        // 保持节点不被销毁
        director.addPersistRootNode(this.node);
    }
    
    async start() {
        console.log('🎮 GameManager 启动');
        await this.loadGameData();
    }
    
    async loadGameData() {
        try {
            this._userData = await api.getUserInfo();
            this._emotionData = await api.getEmotionResources();
            console.log('📊 用户数据:', this._userData?.nickname);
            console.log('💫 情绪资源:', this._emotionData.length, '种');
        } catch (e) {
            console.error('加载游戏数据失败:', e);
            // 使用默认数据
            this._userData = {
                id: 1,
                nickname: '旅行者',
                level: 1,
                power: 100,
                gold: 1000,
                diamond: 50,
                timeCoin: 100,
                zodiacSign: 1,
                zodiacName: '白羊座',
            };
            this._emotionData = [
                { emotionType: 1, amount: 500 },
                { emotionType: 2, amount: 800 },
                { emotionType: 3, amount: 600 },
                { emotionType: 4, amount: 400 },
                { emotionType: 5, amount: 300 },
            ];
        }
    }
    
    // 切换页面
    switchPage(page: PageType) {
        if (page === this._currentPage) return;
        
        console.log('📄 切换页面:', this._currentPage, '->', page);
        
        // 隐藏当前页面
        const currentPageNode = this._pages.get(this._currentPage);
        if (currentPageNode) {
            currentPageNode.active = false;
        }
        
        // 显示新页面
        let newPageNode = this._pages.get(page);
        if (!newPageNode) {
            // 创建新页面（动态创建）
            newPageNode = this.createPage(page);
            if (newPageNode && this.pageContainer) {
                newPageNode.parent = this.pageContainer;
                this._pages.set(page, newPageNode);
            }
        }
        
        if (newPageNode) {
            newPageNode.active = true;
        }
        
        this._currentPage = page;
    }
    
    // 创建页面
    createPage(page: PageType): Node | null {
        // 页面创建逻辑由各页面脚本自己实现
        const node = new Node(page + '_page');
        return node;
    }
    
    // 刷新用户数据
    async refreshUserData() {
        await this.loadGameData();
    }
}