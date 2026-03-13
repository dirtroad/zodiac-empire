// 资源栏组件
import { _decorator, Component, Node, Label, Color, UITransform, Layers } from 'cc';
import { api, gameState, UserData } from '../managers/ApiClient';

const { ccclass, property } = _decorator;

@ccclass('ResourceBar')
export class ResourceBar extends Component {
    
    @property(Label)
    goldLabel: Label | null = null;
    
    @property(Label)
    diamondLabel: Label | null = null;
    
    @property(Label)
    timecoinLabel: Label | null = null;
    
    start() {
        this.refresh();
    }
    
    async refresh() {
        const user = gameState.user || await api.getUserInfo();
        this.updateDisplay(user);
    }
    
    updateDisplay(user: UserData) {
        if (this.goldLabel) {
            this.goldLabel.string = this.formatNumber(user.gold);
        }
        if (this.diamondLabel) {
            this.diamondLabel.string = this.formatNumber(user.diamond);
        }
        if (this.timecoinLabel) {
            this.timecoinLabel.string = this.formatNumber(user.timeCoin);
        }
    }
    
    formatNumber(num: number): string {
        if (num >= 10000) {
            return (num / 10000).toFixed(1) + 'w';
        }
        return num.toLocaleString();
    }
}