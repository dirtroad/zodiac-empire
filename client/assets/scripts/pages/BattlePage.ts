// 星际战斗页
import { _decorator, Component, Node, Label, Color, UITransform, Layers } from 'cc';
import { GameManager } from '../GameManager';

const { ccclass, property } = _decorator;

@ccclass('BattlePage')
export class BattlePage extends Component {
    
    start() {
        this.createUI();
    }
    
    createUI() {
        // 标题
        this.addLabel('⚔️ 星际战斗', 0, 280, 36, new Color(255, 100, 100));
        
        // 背景区域
        this.addColorBlock(0, 50, 920, 450, new Color(50, 20, 30, 200));
        
        // 战斗模式选择
        this.addLabel('选择战斗模式', 0, 220, 24, new Color(255, 255, 255));
        
        // 模式卡片
        this.createModeCards();
        
        // 战斗记录
        this.addLabel('━━━━ 最近战绩 ━━━━', 0, -100, 18, new Color(150, 150, 150));
        this.addLabel('胜: 10  负: 3  胜率: 76.9%', 0, -140, 20, new Color(255, 255, 255));
        
        // 排名
        this.addLabel('当前排名: #128', 0, -180, 18, new Color(255, 215, 0));
    }
    
    createModeCards() {
        const modes = [
            { name: '快速对战', desc: '随机匹配对手', icon: '⚡', color: new Color(100, 200, 255) },
            { name: '排位赛', desc: '冲击更高排名', icon: '🏆', color: new Color(255, 215, 0) },
            { name: '团队战', desc: '与队友并肩作战', icon: '👥', color: new Color(100, 255, 150) },
        ];
        
        modes.forEach((m, i) => {
            const x = -300 + i * 300;
            
            // 卡片
            this.addColorBlock(x, 50, 250, 200, new Color(60, 40, 50, 220));
            
            // 图标
            this.addLabel(m.icon, x, 100, 48, m.color);
            
            // 名称
            this.addLabel(m.name, x, 30, 24, new Color(255, 255, 255));
            
            // 描述
            this.addLabel(m.desc, x, -10, 16, new Color(180, 180, 180));
            
            // 开始按钮
            this.addLabel('[ 开始 ]', x, -60, 18, new Color(100, 255, 100));
        });
    }
    
    addLabel(text: string, x: number, y: number, fontSize: number, color: Color) {
        const node = new Node('Label');
        node.parent = this.node;
        node.setPosition(x, y, 0);
        node.layer = Layers.Enum.UI_2D;
        
        const uiTransform = node.addComponent(UITransform);
        uiTransform.setContentSize(600, fontSize + 10);
        
        const label = node.addComponent(Label);
        label.string = text;
        label.fontSize = fontSize;
        label.lineHeight = fontSize + 4;
        label.color = color;
        label.horizontalAlign = Label.HorizontalAlign.CENTER;
    }
    
    addColorBlock(x: number, y: number, width: number, height: number, color: Color) {
        const node = new Node('Block');
        node.parent = this.node;
        node.setPosition(x, y, 0);
        node.layer = Layers.Enum.UI_2D;
        
        const uiTransform = node.addComponent(UITransform);
        uiTransform.setContentSize(width, height);
        
        const label = node.addComponent(Label);
        label.string = '█'.repeat(Math.floor(width / 20));
        label.fontSize = height;
        label.lineHeight = height;
        label.color = color;
        label.horizontalAlign = Label.HorizontalAlign.CENTER;
    }
}