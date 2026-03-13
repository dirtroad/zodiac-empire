import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';

// 12星座配置
const ZODIAC_CONFIG = [
  { id: 1, name: '白羊座' },
  { id: 2, name: '金牛座' },
  { id: 3, name: '双子座' },
  { id: 4, name: '巨蟹座' },
  { id: 5, name: '狮子座' },
  { id: 6, name: '处女座' },
  { id: 7, name: '天秤座' },
  { id: 8, name: '天蝎座' },
  { id: 9, name: '射手座' },
  { id: 10, name: '摩羯座' },
  { id: 11, name: '水瓶座' },
  { id: 12, name: '双鱼座' },
];

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('用户不存在');
    }
    return user;
  }

  async findByOpenid(openid: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { openid } });
  }

  async updateProfile(id: number, data: Partial<User>): Promise<User> {
    await this.userRepository.update(id, data);
    return this.findById(id);
  }

  async getUserInfo(id: number) {
    const user = await this.findById(id);
    return {
      id: user.id,
      nickname: user.nickname,
      avatarUrl: user.avatarUrl,
      level: user.level,
      exp: user.exp,
      power: user.power,
      gold: user.gold,
      diamond: user.diamond,
      timeCoin: user.timeCoin,
      bankedTimeCoin: user.bankedTimeCoin || 0,
      onlineMinutes: user.onlineMinutes || 0,
      zodiacSign: user.zodiacSign,
      zodiacName: user.zodiacName,
      vipLevel: user.vipLevel,
      createdAt: user.createdAt,
    };
  }

  // 设置用户星座
  async setZodiacSign(userId: number, zodiacSign: number) {
    if (zodiacSign < 1 || zodiacSign > 12) {
      throw new BadRequestException('星座无效，请选择1-12之间的数字');
    }
    
    const zodiac = ZODIAC_CONFIG.find(z => z.id === zodiacSign);
    if (!zodiac) {
      throw new BadRequestException('星座配置不存在');
    }
    
    const user = await this.findById(userId);
    user.zodiacSign = zodiacSign;
    user.zodiacName = zodiac.name;
    
    await this.userRepository.save(user);
    
    return {
      success: true,
      zodiacSign,
      zodiacName: zodiac.name,
    };
  }

  // 修炼提升 - 消耗金币增加战力
  async upgradePower(userId: number) {
    const user = await this.findById(userId);
    const cost = 100; // 消耗100金币
    
    if (Number(user.gold) < cost) {
      throw new BadRequestException('金币不足');
    }
    
    user.gold = (Number(user.gold) - cost) as any;
    user.power = (Number(user.power) + 10) as any;
    
    await this.userRepository.save(user);
    
    return {
      success: true,
      cost,
      powerIncrease: 10,
      gold: user.gold,
      power: user.power,
    };
  }

  // 更新在线时长
  async updateOnlineTime(userId: number) {
    const user = await this.findById(userId);
    const now = new Date();
    const lastActive = user.lastActiveAt || now;
    
    // 计算距上次心跳的分钟数
    const diffMs = now.getTime() - new Date(lastActive).getTime();
    const diffMinutes = Math.floor(diffMs / 60000);
    
    // 只有间隔小于5分钟才累计（防止作弊）
    if (diffMinutes < 5) {
      user.onlineMinutes = (user.onlineMinutes || 0) + 1;
      
      // 每累计60分钟发放1时空晶体
      if (user.onlineMinutes >= 60) {
        user.timeCoin = (user.timeCoin || 0) + 1;
        user.onlineMinutes = user.onlineMinutes - 60;
      }
    }
    
    user.lastActiveAt = now;
    await this.userRepository.save(user);
    
    return {
      onlineMinutes: user.onlineMinutes,
      timeCoin: user.timeCoin,
      nextCoinIn: 60 - user.onlineMinutes,
    };
  }

  // 存入时空银行
  async depositTimeCoin(userId: number, amount: number) {
    if (amount <= 0) {
      throw new BadRequestException('存入数量必须大于0');
    }
    
    const user = await this.findById(userId);
    
    if (user.timeCoin < amount) {
      throw new BadRequestException('时空晶体不足');
    }
    
    user.timeCoin -= amount;
    user.bankedTimeCoin = (user.bankedTimeCoin || 0) + amount;
    
    await this.userRepository.save(user);
    
    return {
      deposited: amount,
      timeCoin: user.timeCoin,
      bankedTimeCoin: user.bankedTimeCoin,
    };
  }

  // 从时空银行取出
  async withdrawTimeCoin(userId: number, amount: number) {
    if (amount <= 0) {
      throw new BadRequestException('取出数量必须大于0');
    }
    
    const user = await this.findById(userId);
    
    if ((user.bankedTimeCoin || 0) < amount) {
      throw new BadRequestException('银行余额不足');
    }
    
    user.bankedTimeCoin = (user.bankedTimeCoin || 0) - amount;
    user.timeCoin = (user.timeCoin || 0) + amount;
    
    await this.userRepository.save(user);
    
    return {
      withdrawn: amount,
      timeCoin: user.timeCoin,
      bankedTimeCoin: user.bankedTimeCoin,
    };
  }

  // 获取银行信息
  async getBankInfo(userId: number) {
    const user = await this.findById(userId);
    
    // 计算每日利息（0.1%）
    const dailyInterest = Math.floor((user.bankedTimeCoin || 0) * 0.001);
    
    return {
      timeCoin: user.timeCoin,
      bankedTimeCoin: user.bankedTimeCoin || 0,
      dailyInterest,
      interestRate: 0.001,
    };
  }
}