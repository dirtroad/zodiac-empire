import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { Galaxy } from '../../entities/galaxy.entity';
import { BattleRecord } from '../../entities/battle-record.entity';

@Injectable()
export class BattleService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Galaxy)
    private galaxyRepository: Repository<Galaxy>,
    @InjectRepository(BattleRecord)
    private battleRecordRepository: Repository<BattleRecord>,
  ) {}

  async getHistory(userId: number) {
    return this.battleRecordRepository.find({
      where: [{ attackerId: userId }, { defenderId: userId }],
      order: { createdAt: 'DESC' },
      take: 20,
    });
  }

  async startBattle(userId: number, targetId: number) {
    const attacker = await this.userRepository.findOne({ where: { id: userId } });
    const defender = await this.userRepository.findOne({ where: { id: targetId } });

    if (!attacker) {
      throw new NotFoundException('攻击者不存在');
    }
    if (!defender) {
      throw new NotFoundException('目标玩家不存在');
    }

    // 检查护盾
    if (defender.shieldUntil && new Date() < defender.shieldUntil) {
      throw new ForbiddenException('目标玩家有护盾保护');
    }

    return {
      attacker: { id: attacker.id, power: attacker.power, zodiac: attacker.zodiacSign },
      defender: { id: defender.id, power: defender.power, zodiac: defender.zodiacSign },
      battleId: Date.now(), // 临时ID
    };
  }

  async executeBattle(battleId: number, userId: number, customBetAmount?: number) {
    // battleId 为可选参数（攻击时不需要）
    // 如果提供了 battleId，验证其有效性
    if (battleId && battleId > 0) {
      const battle = await this.battleRecordRepository.findOne({ where: { id: battleId } });
      if (!battle) {
        // battleId 无效但不阻止战斗，只是忽略它
        console.log(`⚠️ 战斗记录 ${battleId} 不存在，继续执行战斗`);
      }
    }
    
    // 简化的战斗逻辑
    const attacker = await this.userRepository.findOne({ where: { id: userId } });
    if (!attacker) {
      throw new NotFoundException('玩家不存在');
    }
    
    const attackerGalaxies = await this.galaxyRepository.find({ where: { userId } });
    
    // 计算攻击方战力 = 基础战力 + 战斗加成(10%)
    const basePower = Number(attacker.power) || 100;
    const battleBonus = Math.floor(basePower * 0.1); // 战斗加成10%
    const attackPower = basePower + battleBonus;
    console.log(`⚔️ 战力: 基础=${basePower}, 战斗加成=+${battleBonus}, 最终=${attackPower}`);

    // 随机匹配一个目标（实际应该从战斗记录获取）
    const targets = await this.userRepository
      .createQueryBuilder('user')
      .where('user.id != :userId', { userId })
      .orderBy('RAND()')
      .limit(1)
      .getMany();

    if (targets.length === 0) {
      throw new NotFoundException('没有可攻击的目标');
    }

    const defender = targets[0];
    const defensePower = Number(defender.power) || 100;

    // 战斗结果 - 增加悬念和运气成分
    // 基础胜率
    let baseWinChance = basePower / (basePower + defensePower);
    
    // 运气系数：±30% 随机波动，增加不确定性
    const luckFactor = 0.7 + Math.random() * 0.6; // 0.7 ~ 1.3
    baseWinChance *= luckFactor;
    
    // 弱者保护：弱势方额外 +15% 胜率，让战斗更有悬念
    if (baseWinChance < 0.4) {
      baseWinChance += 0.15; // 弱势方保护
    } else if (baseWinChance > 0.6) {
      baseWinChance -= 0.1; // 强势方略微削弱
    }
    
    // 限制胜率范围：10% ~ 90%，避免绝对胜负
    const winChance = Math.max(0.1, Math.min(0.9, baseWinChance));
    const isWin = Math.random() < winChance;
    
    console.log(`🎲 战斗胜率计算：基础=${(basePower / (basePower + defensePower) * 100).toFixed(1)}%, 运气=${(luckFactor * 100).toFixed(0)}%, 最终=${(winChance * 100).toFixed(1)}%, 结果=${isWin ? '胜' : '负'}');
    
    // 用于显示的战力数值
    const displayAttack = Math.floor(basePower * (0.8 + Math.random() * 0.4));
    const displayDefense = Math.floor(defensePower * (0.8 + Math.random() * 0.4));
    // 赌注：自定义 > 默认10% > 最少10金币，如果金币不足10则免费战斗
    let betAmount = customBetAmount || Math.floor(Number(attacker.gold) * 0.1);
    betAmount = Math.min(Math.max(betAmount, 10), Number(attacker.gold) || 0);

    // 奖励/损失金币
    const goldReward = isWin ? betAmount : -betAmount;

    if (isWin) {
      // 胜：获得赌注
      await this.userRepository.increment({ id: userId }, 'gold', betAmount);
      await this.userRepository.decrement({ id: defender.id }, 'gold', betAmount);
    } else {
      // 败：损失赌注
      await this.userRepository.decrement({ id: userId }, 'gold', betAmount);
      await this.userRepository.increment({ id: defender.id }, 'gold', betAmount);
    }

    // 保存战斗记录
    const record = this.battleRecordRepository.create({
      attackerId: userId,
      defenderId: defender.id,
      result: isWin ? 'win' : 'lose',
      attackPower: Math.floor(attackPower),
      defensePower: Math.floor(defensePower),
      goldReward,
    });
    await this.battleRecordRepository.save(record);

    // 战斗胜利，战力提升 10%
    const powerIncrease = isWin ? Math.floor(displayAttack * 0.1) : 0;
    if (isWin && powerIncrease > 0) {
      await this.userRepository.increment({ id: userId }, 'power', powerIncrease);
      await this.userRepository.increment({ id: userId }, 'attack', Math.floor(powerIncrease * 0.5));
      await this.userRepository.increment({ id: userId }, 'defense', Math.floor(powerIncrease * 0.5));
    }
    
    // 连胜奖励
    let winStreakReward = { gold: 0, item: null, title: null };
    if (isWin) {
      // 更新连胜
      await this.userRepository.increment({ id: userId }, 'winStreak', 1);
      
      // 获取当前连胜
      const currentUser = await this.userRepository.findOne({ where: { id: userId } });
      const streak = currentUser.winStreak + 1;
      
      // 更新最大连胜
      if (streak > (currentUser.maxWinStreak || 0)) {
        await this.userRepository.update({ id: userId }, { maxWinStreak: streak });
      }
      
      // 连胜奖励
      if (streak === 3) {
        winStreakReward.gold = 500;
        await this.userRepository.increment({ id: userId }, 'gold', 500);
      } else if (streak === 5) {
        winStreakReward.gold = 1000;
        winStreakReward.item = { name: '史诗碎片', quantity: 1 };
        await this.userRepository.increment({ id: userId }, 'gold', 1000);
        // 简化：史诗碎片暂时用 timeCoin 代替
        await this.userRepository.increment({ id: userId }, 'timeCoin', 1);
      } else if (streak === 10) {
        winStreakReward.gold = 10000;
        winStreakReward.title = '常胜将军';
        await this.userRepository.increment({ id: userId }, 'gold', 10000);
        // 称号暂时记录在 nickname 前缀
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user.nickname.includes('常胜将军')) {
          await this.userRepository.update({ id: userId }, { 
            nickname: '【常胜将军】' + user.nickname 
          });
        }
      }
    } else {
      // 失败重置连胜
      await this.userRepository.update({ id: userId }, { winStreak: 0 });
    }
    
    // 获取更新后的用户数据
    const updatedUser = await this.userRepository.findOne({ where: { id: userId } });
    
    return {
      result: isWin ? 'win' : 'lose',
      attackPower: Math.floor(attackPower),
      defensePower: Math.floor(defensePower),
      goldReward,
      powerIncrease,
      winStreak: updatedUser.winStreak || 0,
      maxWinStreak: updatedUser.maxWinStreak || 0,
      winStreakReward,
    };
  }

  async getRanking() {
    return this.userRepository.find({
      order: { power: 'DESC' },
      take: 100,
      select: ['id', 'nickname', 'power', 'zodiacSign', 'level'],
    });
  }
}