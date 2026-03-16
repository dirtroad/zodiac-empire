import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { User } from '../../entities/user.entity';

@Injectable()
export class WandererUnionService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async joinUnion(userId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    
    // 检查是否有地盘（有地盘的是领主，不能加入流浪者工会）
    // 简化：通过 territoryId 字段判断，null 表示流浪者
    
    if (user.territoryId) {
      throw new BadRequestException('你有地盘，不能加入流浪者工会');
    }

    if (user.unionId) {
      throw new BadRequestException('已在工会中');
    }

    // 分配工会 ID（简化：按用户 ID 分组）
    const unionId = Math.floor(userId / 1000);

    await this.userRepository.update({ id: userId }, { unionId });

    return {
      success: true,
      unionId,
      message: '🎉 加入流浪者工会成功！',
    };
  }

  async getUnionMembers(userId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    
    if (!user.unionId) {
      return { joined: false, message: '未加入工会' };
    }

    const members = await this.userRepository.find({
      where: { unionId: user.unionId },
      select: ['id', 'nickname', 'level', 'power', 'zodiacSign'],
      take: 50,
    });

    return {
      joined: true,
      unionId: user.unionId,
      memberCount: members.length,
      members,
      benefits: [
        '资源共享点',
        '集体攻击地盘',
        '集体购买地盘',
        '工会成员互助',
      ],
    };
  }

  async unionAttack(leaderId: number, territoryId: number) {
    const leader = await this.userRepository.findOne({ where: { id: leaderId } });
    
    if (!leader.unionId) {
      throw new BadRequestException('未加入工会');
    }

    // 获取工会成员
    const members = await this.userRepository.find({
      where: { unionId: leader.unionId },
      select: ['id', 'power'],
    });

    // 计算工会总战力
    const totalPower = members.reduce((sum, m) => sum + Number(m.power), 0);

    return {
      success: true,
      totalPower,
      participantCount: members.length,
      message: `工会集体攻击！总战力：${totalPower}`,
    };
  }

  async leaveUnion(userId: number) {
    await this.userRepository.update({ id: userId }, { unionId: null });
    return { success: true, message: '已退出流浪者工会' };
  }
}
