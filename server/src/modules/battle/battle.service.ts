import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
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

  async executeBattle(battleId: number, userId: number) {
    // 简化的战斗逻辑
    const attacker = await this.userRepository.findOne({ where: { id: userId } });
    if (!attacker) {
      throw new NotFoundException('玩家不存在');
    }
    
    const attackerGalaxies = await this.galaxyRepository.find({ where: { userId } });
    
    // 计算攻击方战力
    const attackPower = attacker.power + 
      attackerGalaxies.reduce((sum, g) => sum + g.defensePower, 0);

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
    const defensePower = defender.power;

    // 战斗结果
    const attackBonus = Math.random() * 0.3 + 0.85; // 85%-115%
    const defenseBonus = Math.random() * 0.3 + 0.85;

    const finalAttack = attackPower * attackBonus;
    const finalDefense = defensePower * defenseBonus;

    const isWin = finalAttack > finalDefense;
    const goldReward = isWin ? Math.floor(defender.gold * 0.1) : 0;

    if (isWin && goldReward > 0) {
      await this.userRepository.increment({ id: userId }, 'gold', goldReward);
      await this.userRepository.decrement({ id: defender.id }, 'gold', goldReward);
    }

    // 保存战斗记录
    const record = this.battleRecordRepository.create({
      attackerId: userId,
      defenderId: defender.id,
      result: isWin ? 'win' : 'lose',
      attackPower: Math.floor(finalAttack),
      defensePower: Math.floor(finalDefense),
      goldReward,
    });
    await this.battleRecordRepository.save(record);

    return {
      result: isWin ? 'win' : 'lose',
      attackPower: Math.floor(finalAttack),
      defensePower: Math.floor(finalDefense),
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