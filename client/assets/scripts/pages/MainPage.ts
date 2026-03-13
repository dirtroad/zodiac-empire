// 主页面 - 游戏首页
import { _decorator, Component, Node, Label, Button } from 'cc';
import { api, gameState } from '../managers/ApiClient';

const { ccclass, property } = _decorator;

type PageType = 'home' | 'galaxy' | 'battle' | 'market' | 'profile';

@ccclass('MainPage')
export class MainPage extends Component {
    
    @property(Label)
    nicknameLabel: Label | null = null;
    
    @property(Label)
    levelLabel: Label | null = null;
    
    @property(Label)
    powerLabel: Label | null = null;
    
    @property(Label)
    goldLabel: Label | null = null;
    
    @property(Label)
    timeCoinLabel: Label | null = null;
    
    @property(Node)
    tabButtons: Node | null = null;
    
    @property(Node)
    pageContainer: Node | null = null;
    
    private _currentPage: PageType = 'home';
    private _heartbeatTimer: number = 0;
    
    async onLoad() {
        console.log('🏠 MainPage 加载');
        await this.refreshUI();
        this.startHeartbeat();
    }
    
    async refreshUI() {
        const user = gameState.user;
        if (!user) return;
        
        if (this.nicknameLabel) {
            this.nicknameLabel.string = user.nickname || '旅行者';
        }
        
        if (this.levelLabel) {
            this.levelLabel.string = `Lv.${user.level}`;
        }
        
        if (this.powerLabel) {
            this.powerLabel.string = `战力: ${user.power}`;
        }
        
        if (this.goldLabel) {
            this.goldLabel.string = `金币: ${user.gold}`;
        }
        
        if (this.timeCoinLabel) {
            this.timeCoinLabel.string = `时间币: ${user.timeCoin}`;
        }
    }
    
    startHeartbeat() {
        // 每60秒发送心跳
        this._heartbeatTimer = this.schedule(async () => {
            try {
                const result = await api.heartbeat();
                console.log('💓 心跳:', result.onlineMinutes, '分钟');
                if (gameState.user) {
                    gameState.user.onlineMinutes = result.onlineMinutes;
                    gameState.user.timeCoin = result.timeCoin;
                }
                this.refreshUI();
            } catch (e) {
                console.error('心跳失败:', e);
            }
        }, 60) as unknown as number;
    }
    
    onDestroy() {
        this.unschedule(this._heartbeatTimer);
    }
    
    switchPage(page: PageType) {
        if (page === this._currentPage) return;
        
        console.log('📄 切换页面:', this._currentPage, '->', page);
        this._currentPage = page;
        
        // 更新tab按钮状态
        // TODO: 实现页面切换逻辑
    }
    
    onTabHome() { this.switchPage('home'); }
    onTabGalaxy() { this.switchPage('galaxy'); }
    onTabBattle() { this.switchPage('battle'); }
    onTabMarket() { this.switchPage('market'); }
    onTabProfile() { this.switchPage('profile'); }
    
    // 收取情绪资源
    async collectEmotions() {
        try {
            const emotions = await api.getEmotionResources();
            let totalCollected = 0;
            
            for (const emotion of emotions) {
                if (emotion.collectable > 0) {
                    await api.collectEmotion(emotion.emotionType);
                    totalCollected += emotion.collectable;
                }
            }
            
            console.log('💰 收取情绪资源:', totalCollected);
            this.refreshUI();
        } catch (e) {
            console.error('收取失败:', e);
        }
    }
    
    // 查看星系
    async viewGalaxies() {
        try {
            const galaxies = await api.getGalaxies();
            console.log('🌌 我的星系:', galaxies.length, '个');
            this.switchPage('galaxy');
        } catch (e) {
            console.error('获取星系失败:', e);
        }
    }
    
    // 查看地盘列表
    async viewTerritories() {
        try {
            // 获取用户位置（模拟）
            const lat = 39.9;
            const lng = 116.4;
            const mapData = await api.getLocalMap(lat, lng);
            console.log('📍 附近玩家:', mapData.players?.length || 0, '个');
            console.log('📍 附近资源:', mapData.resources?.length || 0, '个');
            // TODO: 打开地盘列表页面
        } catch (e) {
            console.error('获取地图失败:', e);
        }
    }
    
    // 退出登录
    logout() {
        gameState.clearToken();
        const { director } = require('cc');
        director.loadScene('LoginScene');
    }
}