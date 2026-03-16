import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';

@Injectable()
export class DailySigninService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async checkin(userId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new BadRequestException('用户不存在');

    const now = new Date();
    const today = now.toDateString();
    const lastSignin = user.lastSigninAt ? new Date(user.lastSigninAt).toDateString() : null;

    // 检查今天是否已签到
    if (lastSignin === today) {
      throw new BadRequestException('今天已经签到过了');
    }

    // 计算连续签到天数
    let consecutiveDays = user.consecutiveSigninDays || 0;
    if (lastSignin) {
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      if (new Date(user.lastSigninAt).toDateString() === yesterday.toDateString()) {
        consecutiveDays += 1;
      } else {
        consecutiveDays = 1; // 断签，重新计算
      }
    } else {
      consecutiveDays = 1;
    }

    // 签到奖励
    let goldReward = 100; // 基础奖励
    let crystalReward = 0;
    let equipmentReward = null;
    let bonusType = 'daily';

    // 第 7 天奖励
    if (consecutiveDays === 7) {
      goldReward = 500;
      bonusType = 'week';
    }
    // 第 30 天奖励
    else if (consecutiveDays === 30) {
      goldReward = 1000;
      crystalReward = 100;
      equipmentReward = { name: '稀有装备', type: 'epic', quality: 'epic' };
      bonusType = 'month';
      consecutiveDays = 0; // 重置连续签到
    }

    // 发放奖励
    await this.userRepository.increment({ id: userId }, 'gold', goldReward);
    if (crystalReward > 0) {
      await this.userRepository.increment({ id: userId }, 'timeCoin', crystalReward);
    }

    // 更新签到时间
    user.lastSigninAt = now;
    user.consecutiveSigninDays = consecutiveDays;
    await this.userRepository.save(user);

    return {
      success: true,
      reward: {
        gold: goldReward,
        crystal: crystalReward,
        equipment: equipmentReward,
      },
      bonusType,
      consecutiveDays,
      message: this.getSigninMessage(bonusType, goldReward),
    };
  }

  getSigninMessage(bonusType: string, gold: number): string {
    const messages = {
      daily: `✅ 签到成功！获得金币×${gold}`,
      week: `🎉 连续签到 7 天！获得金币×${gold}！`,
      month: `🏆 连续签到 30 天！获得金币×${gold} + 时空晶体×100 + 稀有装备×1！`,
    };
    // @ts-ignore
    return messages[bonusType] || `签到成功！`;
  }

  async getSigninStatus(userId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new BadRequestException('用户不存在');

    const now = new Date();
    const today = now.toDateString();
    const lastSignin = user.lastSigninAt ? new Date(user.lastSigninAt).toDateString() : null;
    const hasSignedToday = lastSignin === today;

    return {
      hasSignedToday,
      consecutiveDays: user.consecutiveSigninDays || 0,
      lastSigninAt: user.lastSigninAt,
      nextReward: this.getNextReward(user.consecutiveSigninDays || 0),
    };
  }

  getNextReward(days: number): { day: number; reward: string } {
    if (days >= 29) return { day: 30, reward: '金币×1000 + 晶体×100 + 稀有装备' };
    if (days >= 6) return { day: 7, reward: '金币×500' };
    return { day: 1, reward: '金币×100' };
  }
}
