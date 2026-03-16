import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { User } from '../../entities/user.entity';

@Injectable()
export class WeddingService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async propose(userId: number, targetId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    const target = await this.userRepository.findOne({ where: { id: targetId } });
    
    if (!target) throw new BadRequestException('用户不存在');
    if (user.spouseId) throw new BadRequestException('你已经结婚了');
    if (target.spouseId) throw new BadRequestException('对方已经结婚了');

    // 检查星座匹配度（简化：同元素星座）
    const matchScore = this.calculateMatchScore(user, target);
    
    return {
      success: true,
      matchScore,
      message: `💍 求婚申请已发送！星座匹配度：${matchScore}%`,
    };
  }

  async acceptProposal(userId: number, proposerId: number, weddingType: 'basic' | 'luxury' = 'basic') {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    const proposer = await this.userRepository.findOne({ where: { id: proposerId } });
    
    if (user.spouseId || proposer.spouseId) {
      throw new BadRequestException('一方已经结婚');
    }

    // 婚礼费用
    const cost = weddingType === 'basic' ? 9999 : 52000;
    const totalGold = Number(user.gold) + Number(proposer.gold);
    
    if (totalGold < cost) {
      throw new BadRequestException(`金币不足，需要${cost}金币（基础婚礼）`);
    }

    // 扣除金币（各付一半）
    const halfCost = Math.floor(cost / 2);
    await this.userRepository.decrement({ id: userId }, 'gold', halfCost);
    await this.userRepository.decrement({ id: proposerId }, 'gold', halfCost);

    // 更新婚姻状态
    const now = new Date();
    await this.userRepository.update({ id: userId }, {
      spouseId: proposerId,
      spouseName: proposer.nickname,
      weddingDate: now,
      hasWeddingBuff: true,
    });
    await this.userRepository.update({ id: proposerId }, {
      spouseId: userId,
      spouseName: user.nickname,
      weddingDate: now,
      hasWeddingBuff: true,
    });

    const title = weddingType === 'basic' ? '新婚夫妇' : '星际眷侣';
    
    return {
      success: true,
      message: `🎉 婚礼成功！恭喜成为"${title}"！战力 +20%`,
      weddingType,
      cost,
    };
  }

  calculateMatchScore(user1: User, user2: User): number {
    // 简化版星座匹配计算
    const zodiac1 = user1.zodiacSign || 1;
    const zodiac2 = user2.zodiacSign || 1;
    
    // 同元素星座匹配度高
    const fire = [1, 5, 9]; // 白羊、狮子、射手
    const earth = [2, 6, 10]; // 金牛、处女、摩羯
    const air = [3, 7, 11]; // 双子、天秤、水瓶
    const water = [4, 8, 12]; // 巨蟹、天蝎、双鱼
    
    const inSameGroup = 
      (fire.includes(zodiac1) && fire.includes(zodiac2)) ||
      (earth.includes(zodiac1) && earth.includes(zodiac2)) ||
      (air.includes(zodiac1) && air.includes(zodiac2)) ||
      (water.includes(zodiac1) && water.includes(zodiac2));
    
    if (inSameGroup) return 90 + Math.floor(Math.random() * 10); // 90-99%
    return 60 + Math.floor(Math.random() * 30); // 60-89%
  }

  async getWeddingStatus(userId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    
    if (!user.spouseId) {
      return { married: false, message: '💔 单身贵族' };
    }
    
    return {
      married: true,
      spouseId: user.spouseId,
      spouseName: user.spouseName,
      weddingDate: user.weddingDate,
      hasBuff: user.hasWeddingBuff,
      buffDescription: '夫妻同心，战力 +20%',
    };
  }

  async divorce(userId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    
    if (!user.spouseId) {
      throw new BadRequestException('你还没结婚');
    }

    // 清除双方婚姻状态
    await this.userRepository.update({ id: userId }, {
      spouseId: null,
      spouseName: null,
      weddingDate: null,
      hasWeddingBuff: false,
    });
    await this.userRepository.update({ id: user.spouseId }, {
      spouseId: null,
      spouseName: null,
      weddingDate: null,
      hasWeddingBuff: false,
    });

    return { success: true, message: '💔 离婚成功，夫妻 Buff 已移除' };
  }
}
