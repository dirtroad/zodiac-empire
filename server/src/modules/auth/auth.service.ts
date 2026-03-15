import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { WechatLoginDto } from './dto/wechat-login.dto';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async wechatLogin(loginDto: WechatLoginDto) {
    // 验证 code 参数
    if (!loginDto.code || loginDto.code.trim() === '') {
      throw new UnauthorizedException('微信登录 code 不能为空');
    }

    // 获取微信openid
    const { openid, unionid } = await this.getWechatOpenid(loginDto.code);

    // 查找或创建用户
    let user = await this.userRepository.findOne({ where: { openid } });
    let isNewUser = false;

    if (!user) {
      user = this.userRepository.create({
        openid,
        unionid,
        nickname: `旅行者${Date.now().toString().slice(-6)}`,
        level: 1,
        power: 100,
        gold: 5000,
        diamond: 100,
        timeCoin: 200,
      });
      await this.userRepository.save(user);
      isNewUser = true;
    }

    // 更新登录时间
    user.lastLoginAt = new Date();
    await this.userRepository.save(user);

    // 生成token
    const payload = { sub: user.id, openid: user.openid };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_in: 7200,
      user: this.toUserDto(user),
      is_new_user: isNewUser,
    };
  }

  private async getWechatOpenid(code: string) {
    const appid = this.configService.get('WECHAT_APPID');
    const secret = this.configService.get('WECHAT_SECRET');
    
    // 开发模式：模拟登录
    if (code.startsWith('dev_') || code === 'test' || !appid || appid === 'your-wechat-appid') {
      console.log('[DEV MODE] 模拟微信登录, code:', code);
      // 使用code作为openid，方便测试
      return { openid: `dev_${code}_${Date.now()}`, unionid: null };
    }

    const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${appid}&secret=${secret}&js_code=${code}&grant_type=authorization_code`;

    try {
      const response = await axios.get(url);
      const { openid, unionid, errcode, errmsg } = response.data;

      if (errcode) {
        throw new UnauthorizedException(`微信登录失败: ${errmsg}`);
      }

      return { openid, unionid };
    } catch (error) {
      throw new UnauthorizedException('微信登录失败');
    }
  }

  async validateUser(userId: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user || user.status !== 1) {
      throw new UnauthorizedException('用户不存在或已被禁用');
    }
    return user;
  }

  private toUserDto(user: User) {
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
      zodiacSign: user.zodiacSign,
      zodiacName: user.zodiacName,
    };
  }
}