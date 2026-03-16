import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';

@Injectable()
export class DungeonService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // 贫民窟副本挑战
  async challengeSlum(userId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    
    if (!user) {
      throw new BadRequestException('用户不存在');
    }

    // 基础奖励：每次 +100 金币
    const baseReward = 100;
    
    // 获取当前连胜次数（存储在用户的某个字段中，这里用 onlineMinutes 临时存储）
    // 实际项目中应该创建新的字段 slumWinStreak
    let winStreak = user.onlineMinutes % 100; // 临时方案：用 onlineMinutes 的个位和十位存储连胜
    
    winStreak += 1;
    
    // 连胜奖励
    let bonusReward = 0;
    let bonusMessage = '';
    
    if (winStreak >= 5) {
      bonusReward = 1000;
      bonusMessage = '🔥 5 连胜奖励：金币×1000！';
      winStreak = 0; // 重置连胜
    } else if (winStreak >= 3) {
      bonusReward = 500;
      bonusMessage = '🎉 3 连胜奖励：金币×500！';
      // 3 连胜后不重置，继续累积到 5 连胜
    }
    
    const totalReward = baseReward + bonusReward;
    
    // 发放金币
    user.gold = (Number(user.gold) + totalReward) as any;
    user.onlineMinutes = (user.onlineMinutes - (user.onlineMinutes % 100)) + winStreak; // 更新连胜
    
    await this.userRepository.save(user);
    
    return {
      success: true,
      dungeon: '贫民窟',
      baseReward,
      bonusReward,
      totalReward,
      winStreak,
      message: `挑战成功！获得 ${baseReward} 金币${bonusMessage ? '，' + bonusMessage : ''}`,
      newGold: user.gold,
    };
  }

  // 重置连胜（玩家主动重置）
  async resetWinStreak(userId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    
    if (!user) {
      throw new BadRequestException('用户不存在');
    }
    
    const winStreak = user.onlineMinutes % 100;
    user.onlineMinutes = user.onlineMinutes - winStreak;
    await this.userRepository.save(user);
    
    return {
      success: true,
      message: '连胜已重置',
      previousStreak: winStreak,
    };
  }
}
