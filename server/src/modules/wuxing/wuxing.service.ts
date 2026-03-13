import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserWuxing } from '../../entities/user-wuxing.entity';
import { User } from '../../entities/user.entity';

// 五行相生相克关系
const WUXING_RELATIONS: {
  sheng: Record<number, number>;
  ke: Record<number, number>;
} = {
  // 相生：金生水，水生木，木生火，火生土，土生金
  sheng: {
    1: 3, // 金生水
    2: 4, // 木生火
    3: 2, // 水生木
    4: 5, // 火生土
    5: 1, // 土生金
  },
  // 相克：金克木，木克土，土克水，水克火，火克金
  ke: {
    1: 2, // 金克木
    2: 5, // 木克土
    3: 4, // 水克火
    4: 1, // 火克金
    5: 3, // 土克水
  },
};

const WUXING_NAMES: Record<number, string> = {
  1: '金',
  2: '木',
  3: '水',
  4: '火',
  5: '土',
};

@Injectable()
export class WuxingService {
  constructor(
    @InjectRepository(UserWuxing)
    private wuxingRepository: Repository<UserWuxing>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getByUserId(userId: number): Promise<UserWuxing | null> {
    return this.wuxingRepository.findOne({ where: { userId } });
  }

  async setWuxing(userId: number, dto: any): Promise<UserWuxing> {
    const { birthDate, birthTime } = dto;
    
    // 简化的五行计算（实际应该用八字算法）
    const mainElement = this.calculateWuxing(birthDate, birthTime);
    
    let wuxing = await this.wuxingRepository.findOne({ where: { userId } });
    
    if (!wuxing) {
      wuxing = this.wuxingRepository.create({ userId, mainElement, birthDate, birthTime });
    } else {
      wuxing.mainElement = mainElement;
      wuxing.birthDate = birthDate;
      wuxing.birthTime = birthTime;
    }
    
    return this.wuxingRepository.save(wuxing);
  }

  private calculateWuxing(birthDate: string, birthTime: string): number {
    // 简化计算：根据生日数字求和模5
    const dateNum = birthDate.replace(/\D/g, '');
    const sum = dateNum.split('').reduce((a, b) => a + parseInt(b), 0);
    return (sum % 5) + 1;
  }

  getWuxingRelations() {
    return {
      names: WUXING_NAMES,
      sheng: WUXING_RELATIONS.sheng,
      ke: WUXING_RELATIONS.ke,
      description: {
        sheng: '相生：团队合作时防御+15%',
        ke: '相克：战斗时攻击+30%',
      },
    };
  }

  async calculateRelationBonus(userId: number, targetUserId: number) {
    const myWuxing = await this.getByUserId(userId);
    const targetWuxing = await this.getByUserId(targetUserId);

    if (!myWuxing || !targetWuxing) {
      return { relation: 'none', attackBonus: 1, defenseBonus: 1 };
    }

    const myElement = myWuxing.mainElement;
    const targetElement = targetWuxing.mainElement;

    // 检查相克关系
    if (WUXING_RELATIONS.ke[myElement] === targetElement) {
      return {
        relation: 'ke',
        myElement: WUXING_NAMES[myElement],
        targetElement: WUXING_NAMES[targetElement],
        attackBonus: 1.3,
        defenseBonus: 1,
        description: `${WUXING_NAMES[myElement]}克${WUXING_NAMES[targetElement]}，攻击+30%`,
      };
    }

    // 检查被克关系
    if (WUXING_RELATIONS.ke[targetElement] === myElement) {
      return {
        relation: 'beike',
        myElement: WUXING_NAMES[myElement],
        targetElement: WUXING_NAMES[targetElement],
        attackBonus: 1,
        defenseBonus: 0.85,
        description: `${WUXING_NAMES[targetElement]}克${WUXING_NAMES[myElement]}，防御-15%`,
      };
    }

    // 检查相生关系
    if (WUXING_RELATIONS.sheng[myElement] === targetElement) {
      return {
        relation: 'sheng',
        myElement: WUXING_NAMES[myElement],
        targetElement: WUXING_NAMES[targetElement],
        attackBonus: 1,
        defenseBonus: 1.15,
        description: `${WUXING_NAMES[myElement]}生${WUXING_NAMES[targetElement]}，合作防御+15%`,
      };
    }

    return {
      relation: 'neutral',
      myElement: WUXING_NAMES[myElement],
      targetElement: WUXING_NAMES[targetElement],
      attackBonus: 1,
      defenseBonus: 1,
    };
  }
}