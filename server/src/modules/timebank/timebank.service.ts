import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TimeCrystal } from '../../entities/time-crystal.entity';
import { TimeCrystalLog } from '../../entities/time-crystal-log.entity';
import { User } from '../../entities/user.entity';

// 星域穿梭消耗
const WARP_COSTS: Record<number, number> = {
  1: 50,  // 火象星域
  2: 50,  // 土象星域
  3: 50,  // 风象星域
  4: 50,  // 水象星域
  5: 200, // 中央星域
  6: 500, // 黑洞边缘
};

@Injectable()
export class TimebankService {
  constructor(
    @InjectRepository(TimeCrystal)
    private crystalRepository: Repository<TimeCrystal>,
    @InjectRepository(TimeCrystalLog)
    private logRepository: Repository<TimeCrystalLog>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getBalance(userId: number): Promise<TimeCrystal | null> {
    return this.crystalRepository.findOne({ where: { userId } });
  }

  async getLogs(userId: number) {
    return this.logRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: 50,
    });
  }

  async useCrystal(userId: number, dto: any) {
    const crystal = await this.getOrCreateCrystal(userId);
    const { amount, type, description } = dto;

    if (crystal.balance < amount) {
      throw new ForbiddenException('时空晶体不足');
    }

    crystal.balance -= amount;
    crystal.totalSpent += amount;
    await this.crystalRepository.save(crystal);

    await this.logRepository.save({
      userId,
      amount: -amount,
      balanceAfter: crystal.balance,
      type,
      description,
    });

    return { balance: crystal.balance };
  }

  async timeWarp(userId: number, targetRealm: number) {
    const crystal = await this.getOrCreateCrystal(userId);
    const cost = WARP_COSTS[targetRealm] || 50;

    if (crystal.balance < cost) {
      throw new ForbiddenException('时空晶体不足');
    }

    crystal.balance -= cost;
    crystal.totalSpent += cost;
    await this.crystalRepository.save(crystal);

    await this.logRepository.save({
      userId,
      amount: -cost,
      balanceAfter: crystal.balance,
      type: 3, // 穿梭
      description: `时空穿梭至星域${targetRealm}`,
    });

    return {
      success: true,
      realm: targetRealm,
      cost,
      balance: crystal.balance,
    };
  }

  // 穿越到指定目的地
  async travel(userId: number, destination: string, cost: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new ForbiddenException('用户不存在');
    }

    // 检查晶体是否足够
    const crystal = await this.getOrCreateCrystal(userId);
    if (crystal.balance < cost) {
      throw new ForbiddenException('时空晶体不足');
    }

    // 扣除晶体
    crystal.balance -= cost;
    crystal.totalSpent += cost;
    await this.crystalRepository.save(crystal);

    // 增加金币和晶体奖励
    const goldReward = 50;
    const crystalReward = 5;
    user.gold = (Number(user.gold) + goldReward) as any;
    user.timeCoin = (Number(user.timeCoin) + crystalReward) as any;
    await this.userRepository.save(user);

    await this.logRepository.save({
      userId,
      amount: -cost,
      balanceAfter: crystal.balance,
      type: 3,
      description: `穿越至${destination}`,
    });

    return {
      success: true,
      destination,
      cost,
      goldReward,
      crystalReward,
      balance: crystal.balance,
      gold: user.gold,
      timeCoin: user.timeCoin,
    };
  }

  async searchConstellationMatch(userId: number) {
    const crystal = await this.getOrCreateCrystal(userId);
    const cost = 30; // 匹配搜索消耗

    if (crystal.balance < cost) {
      throw new ForbiddenException('时空晶体不足');
    }

    crystal.balance -= cost;
    crystal.totalSpent += cost;
    await this.crystalRepository.save(crystal);

    // 随机匹配一个星座兼容的玩家
    const user = await this.userRepository.findOne({ where: { id: userId } });
    const matchedUsers = await this.userRepository
      .createQueryBuilder('user')
      .where('user.id != :userId', { userId })
      .andWhere('user.zodiacSign IS NOT NULL')
      .orderBy('RAND()')
      .limit(5)
      .getMany();

    await this.logRepository.save({
      userId,
      amount: -cost,
      balanceAfter: crystal.balance,
      type: 5, // 匹配
      description: '星座匹配搜索',
    });

    return {
      matches: matchedUsers.map(u => ({
        id: u.id,
        nickname: u.nickname,
        zodiacSign: u.zodiacSign,
        zodiacName: u.zodiacName,
      })),
      cost,
      balance: crystal.balance,
    };
  }

  private async getOrCreateCrystal(userId: number): Promise<TimeCrystal> {
    let crystal = await this.crystalRepository.findOne({ where: { userId } });
    if (!crystal) {
      crystal = this.crystalRepository.create({
        userId,
        balance: 100, // 初始赠送100晶体
        totalEarned: 100,
        totalSpent: 0,
      });
      await this.crystalRepository.save(crystal);
    }
    return crystal;
  }
}