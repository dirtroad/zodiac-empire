import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatMessage } from '../../entities/chat-message.entity';
import { User } from '../../entities/user.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatMessage)
    private messageRepository: Repository<ChatMessage>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // 发送消息
  async sendMessage(userId: number, roomId: string, content: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new ForbiddenException('用户不存在');
    }

    // 检查内容长度
    if (!content || content.trim().length === 0) {
      throw new ForbiddenException('消息内容不能为空');
    }
    if (content.length > 500) {
      throw new ForbiddenException('消息内容不能超过500字');
    }

    // 检查房间权限
    if (roomId.startsWith('zodiac_')) {
      const zodiacNum = parseInt(roomId.split('_')[1]);
      if (user.zodiacSign !== zodiacNum) {
        throw new ForbiddenException('只能在自己星座的聊天室发言');
      }
    }

    const message = this.messageRepository.create({
      roomId,
      userId,
      nickname: user.nickname,
      content: content.trim(),
      zodiacSign: user.zodiacSign,
    });

    return this.messageRepository.save(message);
  }

  // 获取消息列表
  async getMessages(roomId: string, limit: number = 50, beforeId?: number) {
    const query = this.messageRepository
      .createQueryBuilder('msg')
      .where('msg.roomId = :roomId', { roomId })
      .orderBy('msg.createdAt', 'DESC')
      .limit(limit);

    if (beforeId) {
      query.andWhere('msg.id < :beforeId', { beforeId });
    }

    const messages = await query.getMany();
    return messages.reverse(); // 按时间正序返回
  }

  // 获取房间列表
  async getRooms(userId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    
    const rooms = [
      { id: 'global', name: '世界频道', icon: '🌍', memberCount: 0, unread: 0 },
    ];

    // 添加星座频道
    if (user?.zodiacSign) {
      const zodiacNames = ['', '白羊座', '金牛座', '双子座', '巨蟹座', '狮子座', '处女座', '天秤座', '天蝎座', '射手座', '摩羯座', '水瓶座', '双鱼座'];
      const zodiacIcons = ['', '♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'];
      
      rooms.push({
        id: `zodiac_${user.zodiacSign}`,
        name: `${zodiacNames[user.zodiacSign]}频道`,
        icon: zodiacIcons[user.zodiacSign],
        memberCount: 0,
        unread: 0,
      });
    }

    // 获取每个房间的消息数量
    for (const room of rooms) {
      room.memberCount = await this.messageRepository.count({ where: { roomId: room.id } });
    }

    return rooms;
  }

  // 系统消息
  async sendSystemMessage(roomId: string, content: string) {
    const message = this.messageRepository.create({
      roomId,
      userId: 0,
      nickname: '系统',
      content,
      type: 1,
    });
    return this.messageRepository.save(message);
  }
}