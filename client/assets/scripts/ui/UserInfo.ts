// 用户信息组件
import { _decorator, Component, Node, Label, Color, UITransform, Layers, Sprite } from 'cc';
import { api, gameState, UserData } from '../managers/ApiClient';

const { ccclass, property } = _decorator;

@ccclass('UserInfo')
export class UserInfo extends Component {
    
    @property(Label)
    nameLabel: Label | null = null;
    
    @property(Label)
    levelLabel: Label | null = null;
    
    @property(Label)
    powerLabel: Label | null = null;
    
    @property(Label)
    zodiacLabel: Label | null = null;
    
    start() {
        this.refresh();
    }
    
    async refresh() {
        const user = gameState.user || await api.getUserInfo();
        this.updateDisplay(user);
    }
    
    updateDisplay(user: UserData) {
        if (this.nameLabel) {
            this.nameLabel.string = user.nickname;
        }
        if (this.levelLabel) {
            this.levelLabel.string = `Lv.${user.level}`;
        }
        if (this.powerLabel) {
            this.powerLabel.string = `战力: ${user.power}`;
        }
        if (this.zodiacLabel) {
            this.zodiacLabel.string = user.zodiacName;
        }
    }
    
    // 静态方法：创建用户信息UI
    static createUserInfoUI(parent: Node, user: UserData): Node {
        const container = new Node('UserInfo');
        container.parent = parent;
        container.setPosition(200, 280, 0);
        container.layer = Layers.Enum.UI_2D;
        
        const uiTransform = container.addComponent(UITransform);
        uiTransform.setContentSize(300, 100);
        
        // 头像占位
        const avatarNode = new Node('Avatar');
        avatarNode.parent = container;
        avatarNode.setPosition(-80, 0, 0);
        avatarNode.layer = Layers.Enum.UI_2D;
        
        const avatarTransform = avatarNode.addComponent(UITransform);
        avatarTransform.setContentSize(60, 60);
        
        const avatarLabel = avatarNode.addComponent(Label);
        avatarLabel.string = '👤';
        avatarLabel.fontSize = 40;
        avatarLabel.color = new Color(255, 255, 255);
        
        // 用户名
        const nameNode = new Node('Name');
        nameNode.parent = container;
        nameNode.setPosition(30, 20, 0);
        nameNode.layer = Layers.Enum.UI_2D;
        
        const nameTransform = nameNode.addComponent(UITransform);
        nameTransform.setContentSize(150, 30);
        
        const nameLabel = nameNode.addComponent(Label);
        nameLabel.string = user.nickname;
        nameLabel.fontSize = 24;
        nameLabel.color = new Color(255, 255, 255);
        
        // 等级和战力
        const levelNode = new Node('Level');
        levelNode.parent = container;
        levelNode.setPosition(30, -15, 0);
        levelNode.layer = Layers.Enum.UI_2D;
        
        const levelTransform = levelNode.addComponent(UITransform);
        levelTransform.setContentSize(150, 25);
        
        const levelLabel = levelNode.addComponent(Label);
        levelLabel.string = `Lv.${user.level}  战力: ${user.power}`;
        levelLabel.fontSize = 18;
        levelLabel.color = new Color(255, 215, 0);
        
        return container;
    }
}