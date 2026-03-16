import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';

@Injectable()
export class TutorialService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getTutorialStatus(userId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    
    return {
      step: user.tutorialStep || 0,
      unlocked: {
        occupation: user.tutorialStep >= 1, // 第一次占领
        collection: user.tutorialStep >= 2, // 第一次收取
        battle: user.tutorialStep >= 3, // 第一次战斗
        social: user.tutorialStep >= 4, // 第一次社交
      },
      currentTask: this.getCurrentTask(user.tutorialStep || 0),
    };
  }

  getCurrentTask(step: number): string {
    const tasks = [
      '欢迎来到星座帝国！完成新手引导解锁全部功能',
      '🏰 任务 1：占领第一个地盘',
      '💰 任务 2：收取一次地盘产出',
      '⚔️ 任务 3：参与一次战斗',
      '💬 任务 4：进行一次社交互动',
      '🎉 新手引导完成！享受游戏吧！',
    ];
    return tasks[Math.min(step, tasks.length - 1)];
  }

  async completeStep(userId: number, step: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    
    // 只能按顺序解锁
    if (step !== (user.tutorialStep || 0) + 1) {
      return { success: false, message: '请按顺序完成引导任务' };
    }

    await this.userRepository.update({ id: userId }, { tutorialStep: step });

    const rewards = [
      null,
      { gold: 500, message: '🎉 占领奖励：金币×500' },
      { gold: 300, message: '🎉 收取奖励：金币×300' },
      { gold: 500, message: '🎉 战斗奖励：金币×500' },
      { gold: 200, message: '🎉 社交奖励：金币×200' },
    ];

    const reward = rewards[step];
    if (reward && reward.gold) {
      await this.userRepository.increment({ id: userId }, 'gold', reward.gold);
    }

    return {
      success: true,
      step,
      reward,
      nextTask: this.getCurrentTask(step),
      isComplete: step >= 4,
    };
  }
}
