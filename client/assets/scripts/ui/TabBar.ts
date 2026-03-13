// 底部导航栏组件
import { _decorator, Component, Node, Label, Color, UITransform, Layers } from 'cc';

const { ccclass, property } = _decorator;

export type TabType = 'home' | 'galaxy' | 'battle' | 'market' | 'profile';

interface TabItem {
    id: TabType;
    icon: string;
    name: string;
}

@ccclass('TabBar')
export class TabBar extends Component {
    
    @property({ type: Node })
    homeTab: Node | null = null;
    
    @property({ type: Node })
    galaxyTab: Node | null = null;
    
    @property({ type: Node })
    battleTab: Node | null = null;
    
    @property({ type: Node })
    marketTab: Node | null = null;
    
    @property({ type: Node })
    profileTab: Node | null = null;
    
    private currentTab: TabType = 'home';
    private onTabChange: ((tab: TabType) => void) | null = null;
    
    private tabs: TabItem[] = [
        { id: 'home', icon: '🏠', name: '首页' },
        { id: 'galaxy', icon: '🌌', name: '银河' },
        { id: 'battle', icon: '⚔️', name: '战斗' },
        { id: 'market', icon: '🏪', name: '市场' },
        { id: 'profile', icon: '👤', name: '我的' },
    ];
    
    start() {
        this.initTabs();
    }
    
    initTabs() {
        // 动态创建Tab按钮
        this.tabs.forEach((tab, index) => {
            const x = -320 + index * 160;
            const isActive = tab.id === this.currentTab;
            this.createTabButton(tab, x, isActive);
        });
    }
    
    createTabButton(tab: TabItem, x: number, active: boolean) {
        const node = new Node('Tab_' + tab.id);
        node.parent = this.node;
        node.setPosition(x, 0, 0);
        node.layer = Layers.Enum.UI_2D;
        
        const uiTransform = node.addComponent(UITransform);
        uiTransform.setContentSize(120, 70);
        
        const color = active ? new Color(255, 215, 0) : new Color(150, 150, 150);
        
        // Icon
        this.addLabelToNode(node, tab.icon, 0, 10, 28, color);
        
        // Name
        this.addLabelToNode(node, tab.name, 0, -15, 16, color);
    }
    
    addLabelToNode(parent: Node, text: string, x: number, y: number, fontSize: number, color: Color) {
        const node = new Node('Label');
        node.parent = parent;
        node.setPosition(x, y, 0);
        node.layer = Layers.Enum.UI_2D;
        
        const uiTransform = node.addComponent(UITransform);
        uiTransform.setContentSize(100, fontSize + 4);
        
        const label = node.addComponent(Label);
        label.string = text;
        label.fontSize = fontSize;
        label.lineHeight = fontSize + 2;
        label.color = color;
        label.horizontalAlign = Label.HorizontalAlign.CENTER;
    }
    
    setOnTabChange(callback: (tab: TabType) => void) {
        this.onTabChange = callback;
    }
    
    switchTab(tab: TabType) {
        if (tab !== this.currentTab) {
            this.currentTab = tab;
            if (this.onTabChange) {
                this.onTabChange(tab);
            }
            // 重新渲染TabBar
            this.node.removeAllChildren();
            this.initTabs();
        }
    }
    
    getCurrentTab(): TabType {
        return this.currentTab;
    }
}