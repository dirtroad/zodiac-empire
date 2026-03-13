// 登录页面 - 微信登录
import { _decorator, Component, Node, Label, Button, Sprite, Color } from 'cc';
import { api, gameState, UserData } from '../managers/ApiClient';

const { ccclass, property } = _decorator;

@ccclass('LoginPage')
export class LoginPage extends Component {
    
    @property(Label)
    statusLabel: Label | null = null;
    
    @property(Button)
    loginButton: Button | null = null;
    
    @property(Node)
    loadingNode: Node | null = null;
    
    private _isLoggingIn: boolean = false;
    
    onLoad() {
        console.log('📱 LoginPage 加载');
        this.initUI();
    }
    
    async start() {
        // 尝试自动登录
        await this.tryAutoLogin();
    }
    
    initUI() {
        if (this.statusLabel) {
            this.statusLabel.string = '欢迎来到星座帝国';
        }
        
        if (this.loginButton) {
            this.loginButton.node.on(Button.EventType.CLICK, this.onLoginClick, this);
        }
        
        if (this.loadingNode) {
            this.loadingNode.active = false;
        }
    }
    
    async tryAutoLogin() {
        const user = await api.tryAutoLogin();
        if (user) {
            console.log('✅ 自动登录成功:', user.nickname);
            this.onLoginSuccess(user, false);
        }
    }
    
    async onLoginClick() {
        if (this._isLoggingIn) return;
        
        this._isLoggingIn = true;
        this.showLoading(true);
        this.setStatus('正在登录...');
        
        try {
            const result = await api.wechatLogin();
            console.log('✅ 登录成功:', result.user.nickname, '新用户:', result.isNewUser);
            this.onLoginSuccess(result.user, result.isNewUser);
        } catch (e: any) {
            console.error('❌ 登录失败:', e);
            this.setStatus('登录失败: ' + (e.message || '未知错误'));
            this.showLoading(false);
        } finally {
            this._isLoggingIn = false;
        }
    }
    
    onLoginSuccess(user: UserData, isNewUser: boolean) {
        this.showLoading(false);
        this.setStatus(`欢迎, ${user.nickname}!`);
        
        // 延迟跳转到主界面
        this.scheduleOnce(() => {
            this.enterGame(user, isNewUser);
        }, 1);
    }
    
    enterGame(user: UserData, isNewUser: boolean) {
        console.log('🎮 进入游戏, 用户:', user.nickname);
        
        // 如果是新用户，跳转到星座选择页面
        if (isNewUser && !user.zodiacSign) {
            console.log('⭐ 新用户，跳转星座选择');
            // TODO: 跳转到星座选择页面
            this.goToMainScene();
        } else {
            this.goToMainScene();
        }
    }
    
    goToMainScene() {
        // 加载主场景
        const { director } = require('cc');
        director.loadScene('MainScene', (err) => {
            if (err) {
                console.error('加载主场景失败:', err);
                return;
            }
            console.log('🎮 主场景加载完成');
        });
    }
    
    setStatus(text: string) {
        if (this.statusLabel) {
            this.statusLabel.string = text;
        }
    }
    
    showLoading(show: boolean) {
        if (this.loadingNode) {
            this.loadingNode.active = show;
        }
        if (this.loginButton) {
            this.loginButton.interactable = !show;
        }
    }
}