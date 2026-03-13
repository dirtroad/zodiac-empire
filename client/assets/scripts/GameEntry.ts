// 星座帝国 - 游戏入口
import { _decorator, Component, director } from 'cc';

const { ccclass, property } = _decorator;

/**
 * 游戏入口脚本
 * 负责初始化游戏并加载登录场景
 */
@ccclass('GameEntry')
export class GameEntry extends Component {
    
    onLoad() {
        console.log('🚀 星座帝国启动');
        console.log('📅 版本: 1.0.0');
        console.log('🎮 平台:', this.getPlatform());
    }
    
    start() {
        // 延迟加载登录场景
        this.scheduleOnce(() => {
            this.loadLoginScene();
        }, 0.5);
    }
    
    loadLoginScene() {
        console.log('📱 加载登录场景...');
        director.loadScene('LoginScene', (err) => {
            if (err) {
                console.error('❌ 加载登录场景失败:', err);
                return;
            }
            console.log('✅ 登录场景加载完成');
        });
    }
    
    getPlatform(): string {
        if (typeof wx !== 'undefined') {
            return '微信小游戏';
        } else if (typeof window !== 'undefined') {
            return '浏览器';
        } else {
            return 'Cocos Creator';
        }
    }
}