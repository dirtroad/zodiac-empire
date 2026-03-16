import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, Not } from 'typeorm';
import { User } from '../../entities/user.entity';

@Injectable()
export class ZodiacMatchService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async searchMatch(userId: number, crystalCost: number = 30) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    
    if (Number(user.timeCoin) < crystalCost) {
      throw new BadRequestException(`时空晶体不足，需要${crystalCost}`);
    }

    // 扣除晶体
    await this.userRepository.decrement({ id: userId }, 'timeCoin', crystalCost);

    // 根据晶体数量决定匹配人数
    const searchRange = crystalCost >= 30 ? 50 : 20; // 30 晶体搜索 50 人，20 晶体搜索 20 人
    
    // 获取同星座或同元素的用户
    const userZodiac = user.zodiacSign || 1;
    const sameElementZodiacs = this.getSameElementZodiacs(userZodiac);
    
    const matches = await this.userRepository.find({
      where: {
        id: Not(userId),
        zodiacSign: In(sameElementZodiacs),
      },
      take: crystalCost >= 30 ? 10 : 5,
      select: ['id', 'nickname', 'level', 'zodiacSign', 'power'],
    });

    const matchResults = matches.map(m => ({
      id: m.id,
      nickname: m.nickname,
      level: m.level,
      power: m.power,
      zodiacSign: m.zodiacSign,
      matchScore: this.calculateMatchScore(userZodiac, m.zodiacSign),
    })).sort((a, b) => b.matchScore - a.matchScore);

    return {
      success: true,
      cost: crystalCost,
      matchType: crystalCost >= 30 ? '最佳匹配' : '良好匹配',
      matches: matchResults,
    };
  }

  getSameElementZodiacs(zodiac: number): number[] {
    const fire = [1, 5, 9];
    const earth = [2, 6, 10];
    const air = [3, 7, 11];
    const water = [4, 8, 12];
    
    if (fire.includes(zodiac)) return fire;
    if (earth.includes(zodiac)) return earth;
    if (air.includes(zodiac)) return air;
    return water;
  }

  calculateMatchScore(zodiac1: number, zodiac2: number): number {
    if (zodiac1 === zodiac2) return 95 + Math.floor(Math.random() * 5);
    const sameElement = this.getSameElementZodiacs(zodiac1).includes(zodiac2);
    return sameElement ? 80 + Math.floor(Math.random() * 15) : 50 + Math.floor(Math.random() * 30);
  }
}
