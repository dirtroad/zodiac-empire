// 战斗界面管理器 - 表情包方案
// 使用 emoji 代替美术资源，快速实现战斗界面

import { _decorator, Component, Node, Label, Color, UITransform, Layers, Sprite, SpriteFrame, Texture2D, Vec3, tween } from 'cc';

const { ccclass, property } = _decorator;

// 血量条颜色配置
const HP_COLOR_CONFIG = {
    HIGH: new Color(100, 255, 100),    // >50% 绿色 🟢
    MEDIUM: new Color(255, 255, 100),  // 30-50% 黄色 🟡
    LOW: new Color(255, 100, 100),     // <30% 红色 🔴
};

// 战斗日志配置
const MAX_LOG_COUNT = 10;

@ccclass('BattleUI')
export class BattleUI extends Component {
    
    @property(Label)
    public roundLabel: Label | null = null;
    
    @property(Node)
    public playerHPBarNode: Node | null = null;
    
    @property(Node)
    public enemyHPBarNode: Node | null = null;
    
    @property(Label)
    public playerHPLabel: Label | null = null;
    
    @property(Label)
    public enemyHPLabel: Label | null = null;
    
    @property(Node)
    public logContainer: Node | null = null;
    
    // 战斗日志列表
    private battleLogs: string[] = [];
    
    // UI 节点缓存
    private uiNodes: Node[] = [];
    
    start() {
        this.createBattleUI();
    }
    
    onDestroy() {
        // 清理创建的节点
        this.uiNodes.forEach(node => {
            if (node.isValid) {
                node.destroy();
            }
        });
        this.uiNodes = [];
    }
    
    // 创建完整的战斗 UI
    createBattleUI() {
        // 清空现有日志
        this.battleLogs = [];
        
        // 创建回合显示
        this.createRoundDisplay();
        
        // 创建敌方信息区域
        this.createEnemyArea();
        
        // 创建 VS 标志
        this.createVSDisplay();
        
        // 创建玩家信息区域
        this.createPlayerArea();
        
        // 创建战斗日志区域
        this.createLogArea();
        
        // 创建操作按钮
        this.createActionButtons();
        
        // 添加初始日志
        this.addBattleLog('⚔️ 战斗开始！');
    }
    
    // 创建回合显示
    createRoundDisplay() {
        const roundNode = this.createLabel('⚔️ 第 1 回合', 0, 280, 32, new Color(255, 255, 255));
        this.roundLabel = roundNode.getComponent(Label);
    }
    
    // 创建敌方信息区域
    createEnemyArea() {
        // 背景框
        this.createColorBlock(0, 150, 400, 180, new Color(60, 30, 40, 220));
        
        // 敌方头像和名称
        this.createLabel('👤 星尘 (Lv.10)', 0, 200, 24, new Color(255, 200, 200));
        this.createLabel('♌ 狮子座  🔥火系', 0, 175, 18, new Color(255, 150, 150));
        
        // 敌方血量条
        const hpBarNode = this.createHPBar(0, 135, 300, 20, 'enemy');
        this.enemyHPBarNode = hpBarNode;
        
        // 敌方血量文字
        const hpLabel = this.createLabel('HP: 12,000/12,000  100%', 0, 110, 16, new Color(255, 255, 255));
        this.enemyHPLabel = hpLabel.getComponent(Label);
        
        // 敌方属性
        this.createLabel('🛡️ 防御：3,500  ⚔️ 攻击：2,800', -120, 85, 16, new Color(200, 200, 200));
        this.createLabel('💨 闪避：5%  💥 暴击：8%', 120, 85, 16, new Color(200, 200, 200));
    }
    
    // 创建玩家信息区域
    createPlayerArea() {
        // 背景框
        this.createColorBlock(0, -150, 400, 180, new Color(30, 40, 60, 220));
        
        // 玩家头像和名称
        this.createLabel('👤 星际旅行者 (Lv.8)', 0, -100, 24, new Color(200, 220, 255));
        this.createLabel('♈ 白羊座  🔥火系', 0, -125, 18, new Color(150, 180, 255));
        
        // 玩家血量条
        const hpBarNode = this.createHPBar(0, -165, 300, 20, 'player');
        this.playerHPBarNode = hpBarNode;
        
        // 玩家血量文字
        const hpLabel = this.createLabel('HP: 15,000/15,000  100%', 0, -190, 16, new Color(255, 255, 255));
        this.playerHPLabel = hpLabel.getComponent(Label);
        
        // 玩家属性
        this.createLabel('🛡️ 防御：4,000  ⚔️ 攻击：3,200', -120, -215, 16, new Color(200, 200, 200));
        this.createLabel('💨 闪避：8%  💥 暴击：12%', 120, -215, 16, new Color(200, 200, 200));
    }
    
    // 创建 VS 标志
    createVSDisplay() {
        this.createLabel('⚔️ VS ⚔️', 0, 0, 40, new Color(255, 215, 0));
    }
    
    // 创建战斗日志区域
    createLogArea() {
        // 日志标题
        this.createLabel('━━━ 战斗日志 ━━━', -200, -260, 18, new Color(150, 150, 150));
        
        // 日志背景框
        this.createColorBlock(-200, -320, 400, 140, new Color(20, 20, 30, 200));
        
        // 日志容器
        const container = new Node('LogContainer');
        container.parent = this.node;
        container.setPosition(-200, -290, 0);
        container.layer = Layers.Enum.UI_2D;
        this.logContainer = container;
        this.uiNodes.push(container);
        
        // 初始化日志显示
        this.refreshLog();
    }
    
    // 创建操作按钮
    createActionButtons() {
        const buttonY = -380;
        
        // 自动战斗按钮
        this.createButton('[🤖 自动战斗]', -150, buttonY, () => {
            this.addBattleLog('🤖 切换到自动战斗模式');
        });
        
        // 手动技能按钮
        this.createButton('[⚡ 手动技能]', 0, buttonY, () => {
            this.addBattleLog('⚡ 打开技能选择界面');
        });
        
        // 逃跑按钮
        this.createButton('[🏃 逃跑]', 150, buttonY, () => {
            this.addBattleLog('🏃 尝试逃跑...');
        });
    }
    
    // 创建血量条
    createHPBar(x: number, y: number, width: number, height: number, type: string): Node {
        const barNode = new Node(`${type}HPBar`);
        barNode.parent = this.node;
        barNode.setPosition(x, y, 0);
        barNode.layer = Layers.Enum.UI_2D;
        
        const uiTransform = barNode.addComponent(UITransform);
        uiTransform.setContentSize(width, height);
        
        // 血量条背景（使用字符模拟）
        const bgLabel = barNode.addComponent(Label);
        bgLabel.string = '█'.repeat(Math.floor(width / 10));
        bgLabel.fontSize = height;
        bgLabel.lineHeight = height;
        bgLabel.color = new Color(80, 80, 80);
        bgLabel.horizontalAlign = Label.HorizontalAlign.LEFT;
        
        this.uiNodes.push(barNode);
        return barNode;
    }
    
    // 更新血量条
    updateHPBar(type: 'player' | 'enemy', currentHP: number, maxHP: number) {
        const percent = currentHP / maxHP;
        const barNode = type === 'player' ? this.playerHPBarNode : this.enemyHPBarNode;
        const hpLabel = type === 'player' ? this.playerHPLabel : this.enemyHPLabel;
        
        if (!barNode || !hpLabel) return;
        
        // 根据血量改变颜色
        let barColor: Color;
        if (percent > 0.5) {
            barColor = HP_COLOR_CONFIG.HIGH;  // 🟢 绿色
        } else if (percent > 0.3) {
            barColor = HP_COLOR_CONFIG.MEDIUM;  // 🟡 黄色
        } else {
            barColor = HP_COLOR_CONFIG.LOW;  // 🔴 红色
        }
        
        // 更新血量条颜色
        const label = barNode.getComponent(Label);
        if (label) {
            label.color = barColor;
            
            // 更新血量条长度（用字符数量模拟）
            const barWidth = barNode.getComponent(UITransform)?.width || 300;
            const filledBlocks = Math.floor((barWidth / 10) * percent);
            const emptyBlocks = Math.floor(barWidth / 10) - filledBlocks;
            label.string = '█'.repeat(filledBlocks) + '░'.repeat(emptyBlocks);
        }
        
        // 更新血量文字
        hpLabel.string = `HP: ${currentHP.toLocaleString()}/${maxHP.toLocaleString()}  ${Math.floor(percent * 100)}%`;
        
        // 血量低时添加警告表情
        if (percent < 0.3) {
            this.addBattleLog(`🤕 ${type === 'player' ? '玩家' : '敌方'}血量危急！`);
        }
    }
    
    // 创建标签
    createLabel(text: string, x: number, y: number, fontSize: number, color: Color): Node {
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
        
        this.uiNodes.push(node);
        return node;
    }
    
    // 创建色块
    createColorBlock(x: number, y: number, width: number, height: number, color: Color): Node {
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
        
        this.uiNodes.push(node);
        return node;
    }
    
    // 创建按钮
    createButton(text: string, x: number, y: number, onClick?: () => void): Node {
        const node = this.createLabel(text, x, y, 20, new Color(100, 255, 100));
        // 简化版本：实际项目中需要添加点击事件
        return node;
    }
    
    // 添加战斗日志
    addBattleLog(message: string) {
        // 添加到日志列表开头
        this.battleLogs.unshift(message);
        
        // 保持最多 10 条日志
        if (this.battleLogs.length > MAX_LOG_COUNT) {
            this.battleLogs.pop();
        }
        
        // 刷新显示
        this.refreshLog();
    }
    
    // 刷新日志显示
    refreshLog() {
        if (!this.logContainer) return;
        
        // 清空现有日志显示
        this.logContainer.children.forEach(child => child.destroy());
        
        // 显示日志（最多 10 条）
        const startY = 0;
        const lineHeight = 20;
        
        this.battleLogs.forEach((log, index) => {
            const logNode = new Node(`Log${index}`);
            logNode.parent = this.logContainer;
            logNode.setPosition(0, startY - index * lineHeight, 0);
            logNode.layer = Layers.Enum.UI_2D;
            
            const uiTransform = logNode.addComponent(UITransform);
            uiTransform.setContentSize(380, lineHeight);
            
            const label = logNode.addComponent(Label);
            label.string = `· ${log}`;
            label.fontSize = 14;
            label.lineHeight = lineHeight;
            label.color = new Color(255, 255, 255);
            label.horizontalAlign = Label.HorizontalAlign.LEFT;
            
            this.uiNodes.push(logNode);
        });
    }
    
    // ==================== 伤害飘字动画系统 ====================
    
    @property(Node)
    damageTextPrefab: Node = null; // 伤害文字预制体
    
    @property(Node)
    battleField: Node = null; // 战斗区域父节点
    
    // 显示伤害数字
    showDamage(value: number, isCrit: boolean, targetPos: Vec3 | {x: number, y: number}) {
        const pos = targetPos instanceof Vec3 ? targetPos : new Vec3(targetPos.x, targetPos.y, 0);
        const text = isCrit ? `💥${value}` : `-${value}`;
        const color = isCrit ? new Color(255, 50, 50) : new Color(255, 255, 255); // 暴击红色，普通白色
        
        this.createFloatingText(text, pos, 40, false, color, isCrit);
    }
    
    // 创建飘字
    createFloatingText(
        text: string, 
        startPos: Vec3, 
        fontSize: number = 40, 
        isEmoji: boolean = false,
        color: Color = new Color(255, 255, 255),
        isCrit: boolean = false
    ) {
        // 创建文字节点
        const textNode = new Node('DamageText');
        const label = textNode.addComponent(Label);
        
        label.string = text;
        label.fontSize = fontSize;
        label.color = color;
        
        // 如果是 emoji，使用系统字体
        if (isEmoji) {
            label.useSystemFont = true;
        }
        
        // 设置初始位置
        textNode.setPosition(startPos.x, startPos.y + 50, startPos.z);
        
        // 添加到战斗区域
        if (this.battleField) {
            this.battleField.addChild(textNode);
        } else {
            this.node.addChild(textNode);
        }
        
        // 播放飘字动画
        this.playFloatingAnimation(textNode, isCrit);
        
        // 2 秒后销毁
        setTimeout(() => {
            if (textNode.isValid) {
                textNode.destroy();
            }
        }, 2000);
        
        return textNode;
    }
    
    // 飘字动画
    playFloatingAnimation(textNode: Node, isCrit: boolean) {
        const duration = isCrit ? 1.5 : 1.0; // 暴击飘字时间更长
        const startY = textNode.getPosition().y;
        
        tween(textNode)
            .to(duration, { 
                position: new Vec3(
                    textNode.getPosition().x,
                    startY + 100, // 向上飘 100 像素
                    textNode.getPosition().z
                )
            })
            .by(0.1, { scale: new Vec3(0.2, 0.2, 1) }) // 稍微放大
            .to(0.5, { opacity: 0 }) // 最后淡出
            .start();
    }
    
    // 显示治疗飘字（绿色）
    showHeal(value: number, target: Node | {x: number, y: number}) {
        const pos = target instanceof Node ? target.getPosition() : new Vec3(target.x, target.y, 0);
        const text = `+${value}`;
        const color = new Color(100, 255, 100); // 绿色
        this.createFloatingText(text, pos, 40, false, color);
    }
    
    // 显示状态文字（暴击/闪避/格挡）
    showStatusText(status: string, target: Node | {x: number, y: number}) {
        const pos = target instanceof Node ? target.getPosition() : new Vec3(target.x, target.y, 0);
        const emojiMap: Record<string, string> = {
            'crit': '💥暴击!',
            'dodge': '💨闪避!',
            'block': '🛡️格挡!',
            'miss': '❌未命中!',
        };
        
        const text = emojiMap[status] || status;
        this.createFloatingText(text, pos, 50, true, new Color(255, 255, 100), true);
    }
    
    // 显示技能特效
    showSkillEffect(skill: string, pos: {x: number, y: number}) {
        const emoji = this.getSkillEmoji(skill);
        this.createLabel(emoji, pos.x, pos.y, 40, new Color(255, 255, 255));
    }
    
    // 获取技能对应的 emoji
    getSkillEmoji(skill: string): string {
        const map: Record<string, string> = {
            'fire': '🔥',
            'water': '💧',
            'wind': '🌪️',
            'earth': '🪨',
            'light': '✨',
            'dark': '🌑',
            'attack': '⚔️',
            'defend': '🛡️',
            'dodge': '💨',
            'crit': '💥',
        };
        return map[skill] || '⚔️';
    }
    
    // 设置回合数
    setRound(round: number) {
        if (this.roundLabel) {
            this.roundLabel.string = `⚔️ 第 ${round} 回合`;
        }
    }
}
