// 主界面脚本 - 星座帝国
// 使用Cocos Creator 3.8.x 格式
import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('MainGame')
export class MainGame extends Component {
    
    @property(Node)
    titleLabel: Node | null = null;
    
    @property(Node)
    userInfoNode: Node | null = null;
    
    @property(Node)
    resourceNode: Node | null = null;
    
    start() {
        console.log('=== 星座帝国启动 ===');
        this.initUI();
    }
    
    initUI() {
        console.log('初始化UI...');
        // UI初始化逻辑
    }
    
    // 刷新用户信息
    refreshUserInfo() {
        console.log('刷新用户信息');
    }
    
    // 刷新资源显示
    refreshResources() {
        console.log('刷新资源');
    }
}