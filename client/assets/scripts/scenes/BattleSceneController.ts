// 战斗场景控制器
// 管理战斗场景的初始化和战斗流程

import { _decorator, Component, Node, Color, director, Scene } from 'cc';
import { BattleUI } from '../ui/battle/BattleUI';

const { ccclass, property } = _decorator;

// 战斗单位数据
interface BattleUnit {
    name: string;
    level: number;
    zodiac: string;
    element: string;
    maxHP: number;
    currentHP: number;
    defense: number;
    attack: number;
    dodgeRate: number;
    critRate: number;
}

@ccclass('BattleSceneController')
export class BattleSceneController extends Component {
    
    @property
    public playerData: BattleUnit = {
        name: '星际旅行者',
        level: 8,
        zodiac: '♈ 白羊座',
        element: '🔥火系',
        maxHP: 15000,
        currentHP: 15000,
        defense: 4000,
        attack: 3200,
        dodgeRate: 0.08,
        critRate: 0.12,
    };
    
    @property
    public enemyData: BattleUnit = {
        name: '星尘',
        level: 10,
        zodiac: '♌ 狮子座',
        element: '🔥火系',
        maxHP: 12000,
        currentHP: 12000,
        defense: 3500,
        attack: 2800,
        dodgeRate: 0.05,
        critRate: 0.08,
    };
    
    private battleUI: BattleUI | null = null;
    private currentRound: number = 1;
    private isBattling: boolean = false;
    
    start() {
        // 初始化战斗 UI
        this.battleUI = this.node.getComponent(BattleUI);
        if (!this.battleUI) {
            this.battleUI = this.node.addComponent(BattleUI);
        }
        
        // 初始化战斗
        this.initBattle();
    }
    
    initBattle() {
        console.log('⚔️ 战斗开始！');
        
        // 初始化血量显示
        if (this.battleUI) {
            this.battleUI.updateHPBar('player', this.playerData.currentHP, this.playerData.maxHP);
            this.battleUI.updateHPBar('enemy', this.enemyData.currentHP, this.enemyData.maxHP);
            this.battleUI.addBattleLog(`⚔️ 遭遇 ${this.enemyData.name} (Lv.${this.enemyData.level})！`);
        }
        
        this.isBattling = true;
        this.currentRound = 1;
    }
    
    // 执行一个战斗回合
    async executeRound() {
        if (!this.isBattling || !this.battleUI) return;
        
        this.battleUI.setRound(this.currentRound);
        
        // 玩家回合
        const playerAction = this.choosePlayerAction();
        this.executeAction('player', playerAction);
        
        // 等待一小段时间
        await this.wait(500);
        
        // 敌方回合
        const enemyAction = this.chooseEnemyAction();
        this.executeAction('enemy', enemyAction);
        
        // 检查胜负
        this.checkBattleResult();
        
        this.currentRound++;
    }
    
    // 选择玩家行动
    choosePlayerAction(): string {
        const actions = ['attack', 'skill', 'defend'];
        const random = Math.random();
        
        if (random < 0.6) {
            return 'attack';  // 60% 概率普通攻击
        } else if (random < 0.9) {
            return 'skill';   // 30% 概率使用技能
        } else {
            return 'defend';  // 10% 概率防御
        }
    }
    
    // 选择敌方行动
    chooseEnemyAction(): string {
        return this.choosePlayerAction();  // 简化版本：使用相同逻辑
    }
    
    // 执行行动
    executeAction(who: 'player' | 'enemy', action: string) {
        if (!this.battleUI) return;
        
        const attacker = who === 'player' ? this.playerData : this.enemyData;
        const defender = who === 'player' ? this.enemyData : this.playerData;
        
        if (action === 'attack') {
            // 普通攻击
            const damage = this.calculateDamage(attacker, defender, false);
            const isCrit = Math.random() < attacker.critRate;
            const finalDamage = isCrit ? Math.floor(damage * 1.5) : damage;
            
            // 更新血量
            defender.currentHP = Math.max(0, defender.currentHP - finalDamage);
            
            // 显示伤害
            this.battleUI.showDamage(finalDamage, isCrit, {x: 0, y: 0});
            
            // 更新 UI
            this.battleUI.updateHPBar(who === 'player' ? 'enemy' : 'player', 
                                      defender.currentHP, defender.maxHP);
            
            // 添加日志
            const skillEmoji = this.battleUI.getSkillEmoji('attack');
            if (isCrit) {
                this.battleUI.addBattleLog(
                    `${attacker.name} 使用${skillEmoji}攻击，造成 ${finalDamage} 伤害！💥暴击！`
                );
            } else {
                this.battleUI.addBattleLog(
                    `${attacker.name} 使用${skillEmoji}攻击，造成 ${finalDamage} 伤害`
                );
            }
            
        } else if (action === 'skill') {
            // 技能攻击
            const skills = ['fire', 'water', 'wind', 'earth', 'light', 'dark'];
            const skill = skills[Math.floor(Math.random() * skills.length)];
            const damage = this.calculateDamage(attacker, defender, true);
            const isCrit = Math.random() < attacker.critRate;
            const finalDamage = isCrit ? Math.floor(damage * 1.5) : damage;
            
            defender.currentHP = Math.max(0, defender.currentHP - finalDamage);
            
            this.battleUI.showDamage(finalDamage, isCrit, {x: 0, y: 0});
            this.battleUI.showSkillEffect(skill, {x: 0, y: 0});
            this.battleUI.updateHPBar(who === 'player' ? 'enemy' : 'player', 
                                      defender.currentHP, defender.maxHP);
            
            const skillEmoji = this.battleUI.getSkillEmoji(skill);
            this.battleUI.addBattleLog(
                `${attacker.name} 使用${skillEmoji}技能，造成 ${finalDamage} 伤害！`
            );
            
        } else if (action === 'defend') {
            // 防御
            this.battleUI.showSkillEffect('defend', {x: 0, y: 0});
            this.battleUI.addBattleLog(
                `${attacker.name} 使用🛡️防御姿态，减少 30% 伤害`
            );
        }
    }
    
    // 计算伤害
    calculateDamage(attacker: BattleUnit, defender: BattleUnit, isSkill: boolean): number {
        // 基础伤害
        let baseDamage = attacker.attack * (isSkill ? 1.5 : 1.0);
        
        // 幸运系数（80%-120% 随机）
        const luckCoeff = 0.8 + Math.random() * 0.4;
        
        // 最终伤害
        let finalDamage = baseDamage * luckCoeff;
        
        // 防御减伤
        const defenseReduction = defender.defense / (defender.defense + 1000);
        finalDamage = finalDamage * (1 - defenseReduction);
        
        return Math.floor(finalDamage);
    }
    
    // 检查战斗结果
    checkBattleResult() {
        if (!this.battleUI) return;
        
        if (this.enemyData.currentHP <= 0) {
            this.battleUI.addBattleLog('🏆 战斗胜利！');
            this.isBattling = false;
            // 显示胜利界面
            this.showVictory();
        } else if (this.playerData.currentHP <= 0) {
            this.battleUI.addBattleLog('💀 战斗失败...');
            this.isBattling = false;
            // 显示失败界面
            this.showDefeat();
        }
    }
    
    // 显示胜利
    showVictory() {
        if (!this.battleUI) return;
        this.battleUI.addBattleLog('🎉🎉🎉 恭喜获胜！🎉🎉🎉');
        // 实际项目中这里应该打开胜利界面
    }
    
    // 显示失败
    showDefeat() {
        if (!this.battleUI) return;
        this.battleUI.addBattleLog('😢 虽败犹荣，继续加油！');
        // 实际项目中这里应该打开失败界面
    }
    
    // 等待函数
    wait(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    // 开始自动战斗
    startAutoBattle() {
        if (this.isBattling) return;
        
        this.isBattling = true;
        this.autoBattleLoop();
    }
    
    // 自动战斗循环
    async autoBattleLoop() {
        while (this.isBattling) {
            await this.executeRound();
            if (!this.isBattling) break;
            await this.wait(1000);  // 每回合间隔 1 秒
        }
    }
}
