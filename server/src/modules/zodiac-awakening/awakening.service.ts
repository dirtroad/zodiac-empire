import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';

const ZODIAC_TRUE_NAMES = {
  1: { name: '白羊座', trueName: '烈焰战神', element: '火' },
  2: { name: '金牛座', trueName: '大地守护者', element: '土' },
  3: { name: '双子座', trueName: '风之使者', element: '风' },
  4: { name: '巨蟹座', trueName: '海洋领主', element: '水' },
  5: { name: '狮子座', trueName: '太阳王者', element: '火' },
  6: { name: '处女座', trueName: '星辰智者', element: '土' },
  7: { name: '天秤座', trueName: '审判天使', element: '风' },
  8: { name: '天蝎座', trueName: '暗影刺客', element: '水' },
  9: { name: '射手座', trueName: '苍穹猎手', element: '火' },
  10: { name: '摩羯座', trueName: '高山巨人', element: '土' },
  11: { name: '水瓶座', trueName: '时空法师', element: '风' },
  12: { name: '双鱼座', trueName: '梦境先知', element: '水' },
};

@Injectable()
export class AwakeningService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async awaken(userId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    
    if (!user) throw new BadRequestException('用户不存在');
    if (user.level < 20) throw new BadRequestException('需要达到 Lv.20 才能觉醒');
    if (user.isZodiacAwakened) throw new BadRequestException('已经觉醒了');

    // 觉醒费用
    const cost = 50000;
    // @ts-ignore
    if (Number(user.gold) < cost) {
      throw new BadRequestException(`金币不足，需要${cost}金币`);
    }

    // 扣除金币
    await this.userRepository.decrement({ id: userId }, 'gold', cost);

    // 获取星座真名
    // @ts-ignore
    const zodiacSign = user.zodiacSign || 1;
    // @ts-ignore
    const zodiacInfo = ZODIAC_TRUE_NAMES[zodiacSign] || ZODIAC_TRUE_NAMES[1];

    // 更新觉醒状态
    const now = new Date();
    await this.userRepository.update({ id: userId }, {
      isZodiacAwakened: true,
      zodiacTrueName: zodiacInfo.trueName,
      awakenedAt: now,
      // 基础属性 +50%
      power: Math.floor(Number(user.power) * 1.5),
      attack: Math.floor(Number(user.attack) * 1.5),
      defense: Math.floor(Number(user.defense) * 1.5),
    });

    return {
      success: true,
      message: `✨ 觉醒成功！解锁星座真名："${zodiacInfo.trueName}"！基础属性 +50%`,
      trueName: zodiacInfo.trueName,
      element: zodiacInfo.element,
    };
  }

  async getAwakeningStatus(userId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    
    // @ts-ignore
    
    if (!user.isZodiacAwakened) {
      // @ts-ignore
      const zodiacSign = user.zodiacSign || 1;
      // @ts-ignore
      const zodiacInfo = ZODIAC_TRUE_NAMES[zodiacSign] || ZODIAC_TRUE_NAMES[1];
      
      return {
        awakened: false,
        // @ts-ignore
        canAwaken: user.level >= 20,
        requirement: '需要达到 Lv.20',
        // @ts-ignore
        currentLevel: user.level,
        cost: 50000,
        preview: {
          zodiacName: zodiacInfo.name,
          trueName: zodiacInfo.trueName,
          element: zodiacInfo.element,
          bonus: '基础属性 +50%',
        },
      };
    }

    return {
      awakened: true,
      // @ts-ignore
      trueName: user.zodiacTrueName,
      // @ts-ignore
      awakenedAt: user.awakenedAt,
      bonus: '基础属性 +50%',
      // @ts-ignore
      skill: this.getExclusiveSkill(user.zodiacSign),
    };
  }

  getExclusiveSkill(zodiacSign: number): string {
    const skills = {
      1: '烈焰斩', 2: '大地护盾', 3: '飓风术', 4: '海啸',
      5: '太阳耀斑', 6: '星尘治愈', 7: '天平审判', 8: '暗影刺杀',
      9: '苍穹之箭', 10: '山崩地裂', 11: '时空扭曲', 12: '梦境幻境',
    };
    // @ts-ignore
    return skills[zodiacSign] || '未知技能';
  }
}
