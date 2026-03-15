import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Emotion } from '../../entities/emotion.entity';
import { EmotionCard } from '../../entities/emotion-card.entity';
import { EmotionVote } from '../../entities/emotion-vote.entity';
import { User } from '../../entities/user.entity';
import { UploadCardDto } from './dto/upload-card.dto';

// 情绪类型配置
const EMOTION_TYPES = [
  { id: 1, name: '喜悦', color: '#FFD700', production: 10 },
  { id: 2, name: '平和', color: '#87CEEB', production: 8 },
  { id: 3, name: '悲伤', color: '#6495ED', production: 6 },
  { id: 4, name: '愤怒', color: '#DC143C', production: 20 },
  { id: 5, name: '恐惧', color: '#2F4F4F', production: 15 },
  { id: 6, name: '贪婪', color: '#32CD32', production: 12 },
];

// 人气等级阈值
const POPULARITY_LEVELS = [
  { level: 1, name: '普通', threshold: 0, reward: 10 },
  { level: 2, name: '热门', threshold: 100, reward: 50 },
  { level: 3, name: '爆款', threshold: 500, reward: 200 },
  { level: 4, name: '现象级', threshold: 2000, reward: 1000 },
];

@Injectable()
export class EmotionService {
  constructor(
    @InjectRepository(Emotion)
    private emotionRepository: Repository<Emotion>,
    @InjectRepository(EmotionCard)
    private cardRepository: Repository<EmotionCard>,
    @InjectRepository(EmotionVote)
    private voteRepository: Repository<EmotionVote>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // 获取情绪类型配置
  getEmotionTypes() {
    return {
      types: EMOTION_TYPES,
      levels: POPULARITY_LEVELS,
    };
  }

  // 获取用户情绪资源
  async getEmotionResources(userId: number): Promise<any[]> {
    const emotions = await this.emotionRepository.find({ where: { userId } });
    
    // 如果没有，初始化所有情绪类型
    if (emotions.length === 0) {
      for (const type of EMOTION_TYPES) {
        const emotion = this.emotionRepository.create({
          userId,
          emotionType: type.id,
          emotionName: type.name,
          amount: 0,
          dailyProduction: type.production,
        });
        await this.emotionRepository.save(emotion);
      }
      return this.getEmotionResources(userId);
    }

    // 计算可收取的数量
    const now = new Date();
    return emotions.map(e => {
      const lastCollect = e.lastCollectAt || e.createdAt;
      const hoursPassed = (now.getTime() - lastCollect.getTime()) / (1000 * 60 * 60);
      const collectable = Math.floor(hoursPassed * Number(e.dailyProduction) / 24);
      
      return {
        ...e,
        collectable,
        nextCollectIn: Math.max(0, 1 - (hoursPassed % 1)),
      };
    });
  }

  // 收取情绪资源
  async collectEmotion(userId: number, emotionType: number) {
    let emotion = await this.emotionRepository.findOne({
      where: { userId, emotionType },
    });

    // 强制将 amount 转为数字（处理 MySQL bigint 返回字符串的问题）
    const currentAmount = Number(emotion?.amount) || 0;

    // 如果不存在，创建新的情绪记录
    if (!emotion) {
      const typeConfig = EMOTION_TYPES.find(t => t.id === emotionType);
      emotion = this.emotionRepository.create({
        userId,
        emotionType,
        emotionName: typeConfig?.name || '未知',
        amount: 15, // 初始给15点
        dailyProduction: typeConfig?.production || 10,
      });
      await this.emotionRepository.save(emotion);
      return {
        collected: 15,
        totalAmount: 15,
      };
    }

    const now = new Date();
    const lastCollect = emotion.lastCollectAt || emotion.createdAt;
    const hoursPassed = (now.getTime() - lastCollect.getTime()) / (1000 * 60 * 60);
    const collectable = Math.floor(hoursPassed * Number(emotion.dailyProduction) / 24);

    if (collectable <= 0) {
      // 如果没有可收集的，给一些基础值
      const newAmount = currentAmount + 15;
      emotion.amount = newAmount as any;
      emotion.lastCollectAt = now;
      await this.emotionRepository.save(emotion);
      return {
        collected: 15,
        totalAmount: newAmount,
      };
    }

    const newAmount = currentAmount + collectable;
    emotion.amount = newAmount as any;
    emotion.lastCollectAt = now;
    await this.emotionRepository.save(emotion);

    return {
      collected: collectable,
      totalAmount: newAmount,
    };
  }

  // 使用情绪强化修炼
  // 情绪类型对应的属性加成
  private readonly EMOTION_EFFECTS: Record<number, { attr: string, amount: number, effect: string }> = {
    1: { attr: 'power', amount: 10, effect: '修炼+10' },      // 喜悦
    2: { attr: 'defense', amount: 5, effect: '防御+5' },      // 平和
    3: { attr: 'tactics', amount: 3, effect: '战术+3' },      // 悲伤
    4: { attr: 'attack', amount: 8, effect: '攻击+8' },      // 愤怒
    5: { attr: 'dodgeRate', amount: 3, effect: '闪避+3%' },    // 恐惧
    6: { attr: 'goldBonus', amount: 50, effect: '金币+50' },   // 贪婪
  };

  async useEmotionForCultivation(userId: number, emotionType: number, amount: number) {
    const emotion = await this.emotionRepository.findOne({
      where: { userId, emotionType },
    });

    if (!emotion) {
      throw new NotFoundException('情绪资源不存在');
    }

    // 验证 amount 不能为负数
    if (amount <= 0) {
      throw new BadRequestException('情绪使用量必须大于 0');
    }
    
    const currentAmount = Number(emotion.amount) || 0;
    if (currentAmount < amount) {
      throw new BadRequestException(`情绪资源不足，当前${currentAmount}点，需要${amount}点`);
    }

    // 扣除情绪值
    emotion.amount = (currentAmount - amount) as any;
    await this.emotionRepository.save(emotion);

    // 增加用户对应属性
    const user = await this.userRepository.findOne({ where: { id: userId } });
    const eff = this.EMOTION_EFFECTS[emotionType];
    
    if (user && eff) {
      // 根据属性类型增加对应值
      switch (eff.attr) {
        case 'power':
          user.power = (Number(user.power) || 100) + eff.amount;
          break;
        case 'attack':
          user.attack = (Number(user.attack) || 0) + eff.amount;
          break;
        case 'defense':
          user.defense = (Number(user.defense) || 0) + eff.amount;
          break;
        case 'tactics':
          user.tactics = (Number(user.tactics) || 0) + eff.amount;
          break;
        case 'critRate':
          user.critRate = (Number(user.critRate) || 0) + eff.amount;
          break;
        case 'dodgeRate':
          user.dodgeRate = (Number(user.dodgeRate) || 0) + eff.amount;
          break;
        case 'goldBonus':
          user.goldBonus = (Number(user.goldBonus) || 0) + eff.amount;
          break;
      }
      await this.userRepository.save(user);
    }

    return {
      success: true,
      usedAmount: amount,
      remainingAmount: emotion.amount,
      powerIncrease: eff?.attr === 'power' ? eff.amount : 0,
      effect: eff?.effect || '属性提升',
    };
  }

  // 上传情绪卡片
  async uploadCard(userId: number, dto: UploadCardDto) {
    const card = this.cardRepository.create({
      userId,
      title: dto.title,
      contentType: dto.contentType,
      contentUrl: dto.contentUrl,
      thumbnailUrl: dto.thumbnailUrl,
      isAnonymous: dto.isAnonymous || false,
      popularity: 0,
    });
    await this.cardRepository.save(card);
    return { success: true, card };
  }

  // 获取情绪卡片列表
  async getCards(page: number = 1, limit: number = 20, orderBy: string = 'popularity') {
    const skip = (page - 1) * limit;
    const orderConfig = orderBy === 'latest' 
      ? { createdAt: 'DESC' as const } 
      : { popularity: 'DESC' as const };
    
    const [cards, total] = await this.cardRepository.findAndCount({
      order: orderConfig,
      skip,
      take: limit,
      relations: ['user'],
    });
    
    return {
      cards: cards.map(c => ({
        id: c.id,
        title: c.title,
        contentType: c.contentType,
        contentUrl: c.contentUrl,
        thumbnailUrl: c.thumbnailUrl,
        emotionType: c.emotionType,
        popularity: c.popularity,
        nickname: c.user?.nickname,
        createdAt: c.createdAt,
      })),
      total,
      page,
      limit,
    };
  }

  // 获取我的情绪卡片
  async getMyCards(userId: number) {
    const cards = await this.cardRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
    return { cards };
  }

  // 获取卡片详情
  async getCardDetail(id: number) {
    const card = await this.cardRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!card) {
      throw new NotFoundException('卡片不存在');
    }
    return {
      id: card.id,
      title: card.title,
      contentType: card.contentType,
      contentUrl: card.contentUrl,
      thumbnailUrl: card.thumbnailUrl,
      emotionType: card.emotionType,
      popularity: card.popularity,
      nickname: card.user?.nickname,
      createdAt: card.createdAt,
    };
  }

  // 点赞/踩卡片
  async voteCard(userId: number, cardId: number, voteType: number) {
    const card = await this.cardRepository.findOne({ where: { id: cardId } });
    if (!card) {
      throw new NotFoundException('卡片不存在');
    }

    // 检查是否已投票
    const existingVote = await this.voteRepository.findOne({
      where: { userId, cardId },
    });

    if (existingVote) {
      throw new BadRequestException('你已经投票过了');
    }

    // 记录投票
    const vote = this.voteRepository.create({
      userId,
      cardId,
      voteType,
    });
    await this.voteRepository.save(vote);

    // 更新卡片人气
    card.popularity = (card.popularity || 0) + (voteType === 1 ? 1 : -1);
    await this.cardRepository.save(card);

    return { success: true, popularity: card.popularity };
  }

  // 领取卡片奖励
  async collectCardReward(userId: number, cardId: number) {
    const card = await this.cardRepository.findOne({ where: { id: cardId } });
    if (!card) {
      throw new NotFoundException('卡片不存在');
    }

    // 检查是否已领取
    const existingVote = await this.voteRepository.findOne({
      where: { userId, cardId },
    });

    if (!existingVote) {
      throw new BadRequestException('你需要先投票才能领取奖励');
    }

    // 简单奖励：给用户加一些金币
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (user) {
      user.gold = (Number(user.gold) || 0) + 10;
      await this.userRepository.save(user);
    }

    return { success: true, reward: 10 };
  }

}
