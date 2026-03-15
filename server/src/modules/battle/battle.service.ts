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
    // 验证 battleId
    if (!battleId || battleId <= 0) {
      throw new BadRequestException('无效的战斗 ID');
    }
    
    // 检查战斗记录是否存在
    const battle = await this.battleRecordRepository.findOne({ where: { id: battleId } });
    if (!battle) {
      throw new NotFoundException('战斗记录不存在');
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

    // 战斗结果 - 战力影响
    const winChance = basePower / (basePower + defensePower); // 不限制范围
    const isWin = Math.random() < winChance;
    
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

    return {
      result: isWin ? 'win' : 'lose',
      attackPower: Math.floor(attackPower),
      defensePower: Math.floor(defensePower),
      goldReward,
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