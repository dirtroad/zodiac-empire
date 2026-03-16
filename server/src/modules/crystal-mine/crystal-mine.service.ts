import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';

@Injectable()
export class CrystalMineService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async mine(userId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    
    if (!user) throw new BadRequestException('用户不存在');

    const now = new Date();
    const lastMine = user.lastCrystalMineAt;
    
    // 检查冷却时间（4 小时 = 14400 秒）
    if (lastMine) {
      const hoursPassed = (now.getTime() - new Date(lastMine).getTime()) / (1000 * 60 * 60);
      if (hoursPassed < 4) {
        const remaining = Math.ceil(4 - hoursPassed);
        throw new BadRequestException(`晶体矿还在冷却中，还需等待${remaining}小时`);
      }
    }

    // 计算产量：200-1000 基础 + 加成
    const baseAmount = 200 + Math.floor(Math.random() * 800); // 200-1000
    const bonus = Math.floor(baseAmount * (user.crystalMineProductivity || 0) / 100);
    const totalAmount = baseAmount + bonus;

    // 发放晶体
    await this.userRepository.increment({ id: userId }, 'timeCoin', totalAmount);

    // 更新采矿时间
    await this.userRepository.update({ id: userId }, {
      lastCrystalMineAt: now,
    });

    // 特殊区域加成提示
    const specialBonus = bonus > 0 ? `（特殊区域加成 +${bonus}）` : '';
    
    return {
      success: true,
      amount: totalAmount,
      baseAmount,
      bonus,
      message: `⛏️ 采矿成功！获得时空晶体×${totalAmount}${specialBonus}`,
      nextMineTime: new Date(now.getTime() + 4 * 60 * 60 * 1000),
    };
  }

  async getMineStatus(userId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    
    const now = new Date();
    const lastMine = user.lastCrystalMineAt;
    
    let canMine = true;
    let remainingHours = 0;
    
    if (lastMine) {
      const hoursPassed = (now.getTime() - new Date(lastMine).getTime()) / (1000 * 60 * 60);
      if (hoursPassed < 4) {
        canMine = false;
        remainingHours = Math.ceil(4 - hoursPassed);
      }
    }

    return {
      canMine,
      remainingHours,
      lastMineAt: lastMine,
      productivity: user.crystalMineProductivity || 0,
      nextReward: canMine ? '200-1000 时空晶体' : `等待${remainingHours}小时`,
    };
  }

  async boostProductivity(userId: number, amount: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    
    // 消耗金币提升产量加成
    const cost = amount * 100;
    if (Number(user.gold) < cost) {
      throw new BadRequestException(`金币不足，需要${cost}金币`);
    }

    await this.userRepository.decrement({ id: userId }, 'gold', cost);
    await this.userRepository.increment({ id: userId }, 'crystalMineProductivity', amount);

    return {
      success: true,
      newProductivity: (user.crystalMineProductivity || 0) + amount,
      message: `✨ 晶体矿产量提升${amount}%！`,
    };
  }
}
