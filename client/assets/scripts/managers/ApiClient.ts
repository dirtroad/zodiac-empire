// 网络请求管理器 - 与后端API对接
import { _decorator } from 'cc';

const { ccclass } = _decorator;

// API配置
const API_CONFIG = {
    BASE_URL: 'http://localhost:3000/v1',
    TIMEOUT: 10000,
};

// 用户数据类型
export interface UserData {
    id: number;
    nickname: string;
    avatarUrl: string;
    level: number;
    exp: number;
    power: number;
    gold: number;
    diamond: number;
    timeCoin: number;
    bankedTimeCoin: number;
    onlineMinutes: number;
    zodiacSign: number | null;
    zodiacName: string | null;
    vipLevel: number;
}

// 情绪数据类型
export interface EmotionData {
    id: number;
    userId: number;
    emotionType: number;
    emotionName: string;
    amount: string;
    dailyProduction: string;
    collectable: number;
}

// 全局状态管理
class GameState {
    private static _instance: GameState;
    
    static get instance(): GameState {
        if (!GameState._instance) {
            GameState._instance = new GameState();
        }
        return GameState._instance;
    }
    
    private _token: string = '';
    private _user: UserData | null = null;
    private _isNewUser: boolean = false;
    
    get token(): string {
        return this._token;
    }
    
    set token(value: string) {
        this._token = value;
    }
    
    get user(): UserData | null {
        return this._user;
    }
    
    set user(value: UserData | null) {
        this._user = value;
    }
    
    get isLoggedIn(): boolean {
        return !!this._token;
    }
    
    get isNewUser(): boolean {
        return this._isNewUser;
    }
    
    set isNewUser(value: boolean) {
        this._isNewUser = value;
    }
    
    saveToken() {
        if (typeof wx !== 'undefined') {
            wx.setStorageSync('zodiac_token', this._token);
        } else {
            localStorage.setItem('zodiac_token', this._token);
        }
    }
    
    loadToken(): boolean {
        if (typeof wx !== 'undefined') {
            this._token = wx.getStorageSync('zodiac_token') || '';
        } else {
            this._token = localStorage.getItem('zodiac_token') || '';
        }
        return !!this._token;
    }
    
    clearToken() {
        this._token = '';
        this._user = null;
        if (typeof wx !== 'undefined') {
            wx.removeStorageSync('zodiac_token');
        } else {
            localStorage.removeItem('zodiac_token');
        }
    }
}

export const gameState = GameState.instance;

// API客户端
export class ApiClient {
    private static _instance: ApiClient;
    
    static get instance(): ApiClient {
        if (!ApiClient._instance) {
            ApiClient._instance = new ApiClient();
        }
        return ApiClient._instance;
    }
    
    private baseUrl: string = API_CONFIG.BASE_URL;
    private timeout: number = API_CONFIG.TIMEOUT;
    
    // 微信登录
    async wechatLogin(): Promise<{ token: string; user: UserData; isNewUser: boolean }> {
        return new Promise((resolve, reject) => {
            if (typeof wx === 'undefined') {
                // 非微信环境，使用测试登录
                console.log('🔍 非微信环境，使用测试登录');
                this.post('/auth/wechat/login', { code: 'dev_test_' + Date.now() })
                    .then((data: any) => {
                        gameState.token = data.access_token;
                        gameState.user = data.user;
                        gameState.isNewUser = data.is_new_user;
                        gameState.saveToken();
                        resolve({ 
                            token: data.access_token, 
                            user: data.user,
                            isNewUser: data.is_new_user 
                        });
                    })
                    .catch(reject);
                return;
            }
            
            wx.login({
                success: (res) => {
                    if (res.code) {
                        this.post('/auth/wechat/login', { code: res.code })
                            .then((data: any) => {
                                gameState.token = data.access_token;
                                gameState.user = data.user;
                                gameState.isNewUser = data.is_new_user;
                                gameState.saveToken();
                                resolve({ 
                                    token: data.access_token, 
                                    user: data.user,
                                    isNewUser: data.is_new_user 
                                });
                            })
                            .catch(reject);
                    } else {
                        reject(new Error('wx.login failed: ' + res.errMsg));
                    }
                },
                fail: reject
            });
        });
    }
    
    // 刷新token
    async refreshToken(): Promise<string> {
        const data: any = await this.post('/auth/refresh', {});
        gameState.token = data.access_token;
        gameState.saveToken();
        return data.access_token;
    }
    
    // 尝试使用已保存的token登录
    async tryAutoLogin(): Promise<UserData | null> {
        if (!gameState.loadToken()) {
            return null;
        }
        
        try {
            const user = await this.getUserInfo();
            gameState.user = user;
            return user;
        } catch (e) {
            gameState.clearToken();
            return null;
        }
    }
    
    // 获取用户信息
    async getUserInfo(): Promise<UserData> {
        const data: any = await this.get('/users/me');
        gameState.user = data;
        return data;
    }
    
    // 心跳（在线时长）
    async heartbeat(): Promise<{ onlineMinutes: number; timeCoin: string; nextCoinIn: number }> {
        return this.post('/users/heartbeat', {});
    }
    
    // 获取情绪资源
    async getEmotionResources(): Promise<EmotionData[]> {
        return this.get('/emotion/resources');
    }
    
    // 收取情绪资源
    async collectEmotion(emotionType: number): Promise<any> {
        return this.post('/emotion/collect', { emotionType });
    }
    
    // 获取情绪类型列表
    async getEmotionTypes(): Promise<any> {
        return this.get('/emotion/types');
    }
    
    // 获取用户星系
    async getGalaxies(): Promise<any[]> {
        return this.get('/galaxies');
    }
    
    // 创建星系
    async createGalaxy(name: string, type: number): Promise<any> {
        return this.post('/galaxies', { name, type });
    }
    
    // 获取装备模板
    async getEquipmentTemplates(): Promise<any[]> {
        return this.get('/equipment/templates');
    }
    
    // 获取我的装备
    async getMyEquipment(): Promise<any[]> {
        return this.get('/equipment/my');
    }
    
    // 装备抽卡
    async equipmentGacha(type: number): Promise<any> {
        return this.post('/equipment/gacha', { type });
    }
    
    // 获取时间银行信息
    async getTimeBank(): Promise<any> {
        return this.get('/users/bank');
    }
    
    // 存入时间币
    async depositTimeCoin(amount: number): Promise<any> {
        return this.post('/users/bank/deposit', { amount });
    }
    
    // 取出时间币
    async withdrawTimeCoin(amount: number): Promise<any> {
        return this.post('/users/bank/withdraw', { amount });
    }
    
    // 获取本地地图
    async getLocalMap(lat: number, lng: number): Promise<any> {
        return this.get(`/map/local?lat=${lat}&lng=${lng}`);
    }
    
    // 获取战斗排名
    async getBattleRanking(): Promise<any[]> {
        return this.get('/battle/ranking');
    }
    
    // 获取战队排名
    async getTeamRanking(): Promise<any[]> {
        return this.get('/team/ranking');
    }
    
    // 获取五行关系
    async getWuxingRelations(): Promise<any> {
        return this.get('/wuxing/relations');
    }
    
    // 获取市场统计
    async getMarketStats(): Promise<any> {
        return this.get('/market/stats');
    }
    
    // 通用GET请求
    private async get<T>(path: string): Promise<T> {
        return this.request<T>('GET', path);
    }
    
    // 通用POST请求
    private async post<T>(path: string, data?: any): Promise<T> {
        return this.request<T>('POST', path, data);
    }
    
    // 通用请求方法
    private async request<T>(method: string, path: string, data?: any): Promise<T> {
        const url = this.baseUrl + path;
        
        return new Promise((resolve, reject) => {
            const timeoutId = setTimeout(() => {
                reject(new Error('Request timeout'));
            }, this.timeout);
            
            const headers: Record<string, string> = {
                'Content-Type': 'application/json',
            };
            
            if (gameState.token) {
                headers['Authorization'] = `Bearer ${gameState.token}`;
            }
            
            if (typeof wx !== 'undefined') {
                wx.request({
                    url,
                    method: method as any,
                    data,
                    header: headers,
                    success: (res) => {
                        clearTimeout(timeoutId);
                        if (res.statusCode === 200 || res.statusCode === 201) {
                            const response = res.data as any;
                            if (response.code === 0) {
                                resolve(response.data);
                            } else {
                                reject(new Error(response.message || 'API Error'));
                            }
                        } else if (res.statusCode === 401) {
                            // Token过期，清除登录状态
                            gameState.clearToken();
                            reject(new Error('Unauthorized'));
                        } else {
                            reject(new Error(`HTTP ${res.statusCode}`));
                        }
                    },
                    fail: (err) => {
                        clearTimeout(timeoutId);
                        reject(err);
                    },
                });
            } else {
                // 浏览器环境
                fetch(url, {
                    method,
                    headers,
                    body: data ? JSON.stringify(data) : undefined,
                })
                    .then((response) => response.json())
                    .then((response) => {
                        clearTimeout(timeoutId);
                        if (response.code === 0) {
                            resolve(response.data);
                        } else {
                            reject(new Error(response.message || 'API Error'));
                        }
                    })
                    .catch((err) => {
                        clearTimeout(timeoutId);
                        reject(err);
                    });
            }
        });
    }
}

export const api = ApiClient.instance;