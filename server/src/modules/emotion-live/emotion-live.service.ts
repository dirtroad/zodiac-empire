import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';

@Injectable()
export class EmotionLiveService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async startLive(userId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    
    // 检查是否已在直播中
    if (user.isLiveStreaming) {
      throw new BadRequestException('已经在直播中');
    }

    const endTime = new Date(Date.now() + 30 * 60 * 1000); // 30 分钟

    await this.userRepository.update({ id: userId }, {
      isLiveStreaming: true,
      liveStartTime: new Date(),
      liveEndTime: endTime,
      liveViewerCount: 0,
    });

    return {
      success: true,
      message: '🎬 情绪直播已开启！持续 30 分钟',
      endTime,
    };
  }

  async sendGift(senderId: number, targetId: number, emotionType: string, amount: number) {
    const sender = await this.userRepository.findOne({ where: { id: senderId } });
    const target = await this.userRepository.findOne({ where: { id: targetId } });

    if (!target || !target.isLiveStreaming) {
      throw new BadRequestException('对方未在直播');
    }

    // 消耗发送者的情绪
    const emotionKey = `emotion${emotionType.charAt(0).toUpperCase() + emotionType.slice(1)}`;
    if (Number(sender[emotionKey] || 0) < amount) {
      throw new BadRequestException('情绪值不足');
    }

    await this.userRepository.decrement({ id: senderId }, emotionKey, amount);
    await this.userRepository.increment({ id: targetId }, emotionKey, amount);
    await this.userRepository.increment({ id: targetId }, 'liveViewerCount', 1);

    // 观看人数奖励
    if (target.liveViewerCount && target.liveViewerCount >= 10) {
      const bonusEmotion = Math.max(1, Math.floor(amount * 0.5));
      await this.userRepository.increment({ id: targetId }, emotionKey, bonusEmotion);
      
      return {
        success: true,
        message: `🎁 赠送${emotionType}×${amount}！主播获得额外奖励×${bonusEmotion}`,
        bonus: bonusEmotion,
      };
    }

    return {
      success: true,
      message: `🎁 赠送${emotionType}×${amount}成功！`,
    };
  }

  async endLive(userId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    
    if (!user.isLiveStreaming) {
      throw new BadRequestException('未在直播');
    }

    await this.userRepository.update({ id: userId }, {
      isLiveStreaming: false,
      liveStartTime: null,
      liveEndTime: null,
      liveViewerCount: 0,
    });

    return { success: true, message: '🎬 直播已结束' };
  }
}
