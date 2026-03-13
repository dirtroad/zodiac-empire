import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { TimeCrystal } from '../../entities/time-crystal.entity';
import { Territory } from '../../entities/territory.entity';

// 12星座星域配置
const STAR_REALMS = [
  { id: 1, zodiac: 1, name: '白羊座星域', element: '火', powerBonus: 0.05, productionBonus: 0 },
  { id: 2, zodiac: 2, name: '金牛座星域', element: '土', powerBonus: 0, productionBonus: 0.10 },
  { id: 3, zodiac: 3, name: '双子座星域', element: '风', powerBonus: 0.03, productionBonus: 0.03 },
  { id: 4, zodiac: 4, name: '巨蟹座星域', element: '水', powerBonus: 0.02, productionBonus: 0.05 },
  { id: 5, zodiac: 5, name: '狮子座星域', element: '火', powerBonus: 0.08, productionBonus: 0 },
  { id: 6, zodiac: 6, name: '处女座星域', element: '土', powerBonus: 0.02, productionBonus: 0.08 },
  { id: 7, zodiac: 7, name: '天秤座星域', element: '风', powerBonus: 0.05, productionBonus: 0.02 },
  { id: 8, zodiac: 8, name: '天蝎座星域', element: '水', powerBonus: 0.10, productionBonus: 0 },
  { id: 9, zodiac: 9, name: '射手座星域', element: '火', powerBonus: 0.04, productionBonus: 0.04 },
  { id: 10, zodiac: 10, name: '摩羯座星域', element: '土', powerBonus: 0.03, productionBonus: 0.07 },
  { id: 11, zodiac: 11, name: '水瓶座星域', element: '风', powerBonus: 0.06, productionBonus: 0.01 },
  { id: 12, zodiac: 12, name: '双鱼座星域', element: '水', powerBonus: 0.02, productionBonus: 0.06 },
];

// 元素区域
const ELEMENT_ZONES = [
  { id: 1, name: '火象星域', element: '火', zodiacs: [1, 5, 9], enterCost: 50 },
  { id: 2, name: '土象星域', element: '土', zodiacs: [2, 6, 10], enterCost: 50 },
  { id: 3, name: '风象星域', element: '风', zodiacs: [3, 7, 11], enterCost: 50 },
  { id: 4, name: '水象星域', element: '水', zodiacs: [4, 8, 12], enterCost: 50 },
  { id: 5, name: '中央星域', element: 'all', zodiacs: [], enterCost: 200 },
  { id: 6, name: '黑洞边缘', element: 'dark', zodiacs: [], enterCost: 500 },
];

@Injectable()
export class MapService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(TimeCrystal)
    private crystalRepository: Repository<TimeCrystal>,
    @InjectRepository(Territory)
    private territoryRepository: Repository<Territory>,
  ) {}

  async getLocalMap(userId: number, lat: number, lng: number) {
    // 本地LBS地图，返回附近玩家和资源
    // 简化：返回模拟数据
    const nearbyPlayers = await this.userRepository
      .createQueryBuilder('user')
      .where('user.id != :userId', { userId })
      .orderBy('RAND()')
      .limit(10)
      .getMany();

    return {
      type: 'local',
      center: { lat, lng },
      players: nearbyPlayers.map(p => ({
        id: p.id,
        nickname: p.nickname,
        level: p.level,
        zodiac: p.zodiacSign,
        // 模拟位置
        position: {
          lat: lat + (Math.random() - 0.5) * 0.01,
          lng: lng + (Math.random() - 0.5) * 0.01,
        },
      })),
      resources: await this.getNearbyResources(lat, lng),
    };
  }

  async getConstellationMap(userId: number) {
    // 星座地图，需要时空晶体才能进入
    const crystal = await this.crystalRepository.findOne({ where: { userId } });

    return {
      type: 'constellation',
      realms: STAR_REALMS,
      zones: ELEMENT_ZONES.map(z => ({
        ...z,
        canEnter: crystal && crystal.balance >= z.enterCost,
      })),
      crystalBalance: crystal?.balance || 0,
    };
  }

  async getRealmDetail(realmId: number, userId: number) {
    const realm = STAR_REALMS.find(r => r.id === realmId);
    if (!realm) {
      return null;
    }

    // 获取该星域的玩家
    const playersInRealm = await this.userRepository
      .createQueryBuilder('user')
      .where('user.zodiacSign = :zodiac', { zodiac: realm.zodiac })
      .limit(20)
      .getMany();

    return {
      ...realm,
      players: playersInRealm.map(p => ({
        id: p.id,
        nickname: p.nickname,
        level: p.level,
        power: p.power,
      })),
    };
  }

  async enterRealm(userId: number, realmId: number) {
    const zone = ELEMENT_ZONES.find(z => z.id === realmId);
    if (!zone) {
      return { success: false, message: '星域不存在' };
    }

    const crystal = await this.crystalRepository.findOne({ where: { userId } });
    if (!crystal || crystal.balance < zone.enterCost) {
      throw new ForbiddenException('时空晶体不足');
    }

    crystal.balance -= zone.enterCost;
    await this.crystalRepository.save(crystal);

    return {
      success: true,
      zone,
      cost: zone.enterCost,
      remainingCrystal: crystal.balance,
    };
  }

  async getNearbyResources(lat: number, lng: number) {
    // 模拟附近资源点
    const resourceTypes = ['gold', 'exp', 'crystal'];
    return Array.from({ length: 5 }, (_, i) => ({
      id: i + 1,
      type: resourceTypes[Math.floor(Math.random() * 3)],
      amount: Math.floor(Math.random() * 100) + 10,
      position: {
        lat: lat + (Math.random() - 0.5) * 0.01,
        lng: lng + (Math.random() - 0.5) * 0.01,
      },
    }));
  }

  async collectResource(userId: number, resourceId: number) {
    // 简化：直接给奖励
    const resourceTypes = ['gold', 'exp', 'crystal'];
    const type = resourceTypes[Math.floor(Math.random() * 3)];
    const amount = Math.floor(Math.random() * 100) + 10;

    if (type === 'gold') {
      await this.userRepository.increment({ id: userId }, 'gold', amount);
    } else if (type === 'exp') {
      await this.userRepository.increment({ id: userId }, 'exp', amount);
    } else {
      await this.crystalRepository.increment({ userId }, 'balance', amount);
    }

    return { type, amount };
  }

  // ========== 地盘占领系统 ==========

  // 地盘类型配置（地球风格）
  private territoryTypes = [
    { type: 'mall', name: '商场', outputType: 'gold', outputAmount: 80, actionCost: 2 },
    { type: 'factory', name: '工厂', outputType: 'gold', outputAmount: 200, actionCost: 5 },
    { type: 'mine', name: '矿场', outputType: 'crystal', outputAmount: 15, actionCost: 3 },
    { type: 'gold_mine', name: '金矿', outputType: 'gold', outputAmount: 150, actionCost: 4 },
    { type: 'power_station', name: '发电站', outputType: 'gold', outputAmount: 100, actionCost: 2 },
    { type: 'warehouse', name: '仓库', outputType: 'gold', outputAmount: 120, actionCost: 3 },
  ];

  async getNearbyTerritories(userId: number, lat: number, lng: number, radius: number) {
    // 检查是否有地盘，没有则生成
    let territories = await this.territoryRepository
      .createQueryBuilder('t')
      .leftJoinAndSelect('t.owner', 'owner')
      .getMany();
    
    // 如果没有地盘，生成初始地盘
    if (territories.length === 0) {
      const types = this.territoryTypes;
      for (let i = 0; i < 12; i++) {
        const typeConfig = types[i % types.length];
        const territory = this.territoryRepository.create({
          name: `${typeConfig.name}${i + 1}号`,
          type: typeConfig.type,
          typeName: typeConfig.name,
          outputType: typeConfig.outputType,
          outputAmount: typeConfig.outputAmount,
          lat: lat + (Math.random() - 0.5) * 0.05,
          lng: lng + (Math.random() - 0.5) * 0.05,
          accumulatedGold: 0,
          accumulatedCrystal: 0,
        });
        await this.territoryRepository.save(territory);
      }
      territories = await this.territoryRepository
        .createQueryBuilder('t')
        .leftJoinAndSelect('t.owner', 'owner')
        .getMany();
    }
    
    // 计算距离并返回
    return territories.map(t => {
      const distance = Math.floor(Math.sqrt(
        Math.pow((t.lat - lat) * 111000, 2) + 
        Math.pow((t.lng - lng) * 111000, 2)
      ));
      return {
        id: t.id,
        name: t.name,
        type: t.type,
        typeName: t.typeName,
        outputType: t.outputType,
        outputAmount: t.outputAmount,
        distance,
        lat: t.lat,
        lng: t.lng,
        owner: t.owner ? {
          id: t.owner.id,
          nickname: t.owner.nickname,
          level: t.owner.level,
          power: t.owner.power,
          zodiac: t.owner.zodiacSign,
        } : null,
        canCapture: !t.owner,
        canAttack: t.owner && t.owner.id !== userId,
        actionCost: 2,
        accumulatedGold: t.accumulatedGold,
        accumulatedCrystal: t.accumulatedCrystal,
      };
    }).sort((a, b) => a.distance - b.distance);
  }

  async getMyTerritories(userId: number) {
    const territories = await this.territoryRepository
      .createQueryBuilder('t')
      .leftJoinAndSelect('t.owner', 'owner')
      .where('t.ownerId = :userId', { userId })
      .getMany();
    
    return {
      count: territories.length,
      totalProduction: {
        gold: territories.reduce((sum, t) => sum + (t.outputType === 'gold' ? t.outputAmount : 0), 0),
        crystal: territories.reduce((sum, t) => sum + (t.outputType === 'crystal' ? t.outputAmount : 0), 0),
      },
      territories: territories.map(t => ({
        id: t.id,
        name: t.name,
        type: t.type,
        typeName: t.typeName,
        outputType: t.outputType,
        outputAmount: t.outputAmount,
        accumulatedGold: t.accumulatedGold,
        accumulatedCrystal: t.accumulatedCrystal,
      })),
    };
  }

  async captureTerritory(userId: number, territoryId: number, forceAttack: boolean = false) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new Error('用户不存在');
    
    const territory = await this.territoryRepository.findOne({ 
      where: { id: territoryId },
      relations: ['owner']
    });
    if (!territory) throw new Error('地盘不存在');
    
    // 如果地盘已被别人占领，需要战斗
    if (territory.owner && territory.owner.id !== userId) {
      if (!forceAttack) {
        throw new Error('地盘已被占领，需要战斗抢夺');
      }
      
      // 战斗逻辑
      const attackerPower = Number(user.power);
      const defenderPower = Number(territory.owner.power) || 100;
      const attackBonus = Math.random() * 0.3 + 0.85;
      const defenseBonus = Math.random() * 0.3 + 0.85;
      
      const finalAttack = attackerPower * attackBonus;
      const finalDefense = defenderPower * defenseBonus;
      
      if (finalAttack <= finalDefense) {
        return {
          success: false,
          territoryId,
          message: '战斗失败，抢夺未成功',
          battle: { attackPower: Math.floor(finalAttack), defensePower: Math.floor(finalDefense) }
        };
      }
      
      // 战斗胜利，抢夺成功
      // 给原主人产生恐惧情绪
      const oldOwnerId = territory.owner.id;
      
      // 转移所有权
      territory.owner = user;
      territory.lastCollectAt = new Date();
      await this.territoryRepository.save(territory);
      
      return {
        success: true,
        territoryId,
        message: '战斗胜利，抢夺成功！',
        battle: { attackPower: Math.floor(finalAttack), defensePower: Math.floor(finalDefense) },
        output: {
          type: territory.outputType,
          amount: territory.outputAmount,
        },
      };
    }
    
    // 自己的地盘
    if (territory.owner && territory.owner.id === userId) {
      throw new Error('这是你的地盘');
    }
    
    // 无人占领，直接占领
    territory.owner = user;
    territory.lastCollectAt = new Date();
    await this.territoryRepository.save(territory);
    
    return {
      success: true,
      territoryId,
      message: '占领成功！',
      output: {
        type: territory.outputType,
        amount: territory.outputAmount,
      },
    };
  }

  async attackTerritory(userId: number, territoryId: number) {
    const attacker = await this.userRepository.findOne({ where: { id: userId } });
    if (!attacker) throw new Error('用户不存在');
    
    // 模拟战斗
    const attackerPower = Number(attacker.power);
    const defenderPower = Math.floor(Math.random() * 500) + 100;
    
    const success = attackerPower > defenderPower;
    
    if (success) {
      // 产生恐惧情绪
      return {
        success: true,
        territoryId,
        message: '攻击成功！占领该地盘',
        reward: {
          gold: Math.floor(Math.random() * 200) + 100,
          fear: Math.floor(Math.random() * 20) + 10, // 恐惧情绪
        },
      };
    } else {
      return {
        success: false,
        territoryId,
        message: '攻击失败，战力不足',
        defenderPower,
      };
    }
  }

  async requestAlly(userId: number, territoryId: number, message: string) {
    // 发送结盟请求
    return {
      success: true,
      message: '已发送结盟请求',
      territoryId,
    };
  }

  async collectTerritoryResources(userId: number, territoryId: number) {
    // 检查地盘所有权
    const territory = await this.territoryRepository.findOne({ 
      where: { id: territoryId },
      relations: ['owner']
    });
    
    if (!territory) throw new Error('地盘不存在');
    if (!territory.owner || territory.owner.id !== userId) {
      throw new Error('这不是你的地盘');
    }
    
    // 计算产出（按小时累计）
    const now = new Date();
    const lastCollect = territory.lastCollectAt || territory.createdAt;
    const hoursPassed = Math.max(0.1, (now.getTime() - new Date(lastCollect).getTime()) / (1000 * 60 * 60));
    const collectHours = Math.min(hoursPassed, 24); // 最多累计24小时
    
    let goldAmount = 0;
    let crystalAmount = 0;
    
    if (territory.outputType === 'gold') {
      goldAmount = Math.max(1, Math.floor(territory.outputAmount * collectHours));
      await this.userRepository.increment({ id: userId }, 'gold', goldAmount);
    } else if (territory.outputType === 'crystal') {
      crystalAmount = Math.max(1, Math.floor(territory.outputAmount * collectHours));
      await this.userRepository.increment({ id: userId }, 'timeCoin', crystalAmount);
    }
    
    // 更新收取时间
    territory.lastCollectAt = now;
    territory.accumulatedGold = 0;
    territory.accumulatedCrystal = 0;
    await this.territoryRepository.save(territory);
    
    return {
      success: true,
      collected: {
        gold: goldAmount,
        crystal: crystalAmount,
      },
    };
  }

  // ========== 流浪者系统 ==========

  async getNearbyWanderers(userId: number, lat: number, lng: number) {
    // 获取附近没有地盘的玩家
    const wanderers = await this.userRepository
      .createQueryBuilder('user')
      .orderBy('RAND()')
      .limit(5)
      .getMany();
    
    return wanderers.map(w => ({
      id: w.id,
      nickname: w.nickname,
      level: w.level,
      power: w.power,
      zodiac: w.zodiacSign,
      matchBonus: this.calculateMatchBonus(userId, w.id),
    }));
  }

  async shelterWanderer(userId: number, territoryId: number, wandererId: number) {
    // 收留流浪者
    const wanderer = await this.userRepository.findOne({ where: { id: wandererId } });
    const user = await this.userRepository.findOne({ where: { id: userId } });
    
    if (!wanderer || !user) {
      return { success: false, message: '用户不存在' };
    }
    
    return {
      success: true,
      message: `已收留 ${wanderer.nickname}`,
      matchBonus: this.calculateMatchBonus(userId, wandererId),
    };
  }

  async leaveShelter(userId: number) {
    // 离开庇护所
    return {
      success: true,
      message: '已离开庇护所',
    };
  }

  // ========== 辅助方法 ==========

  private async getRandomUser(excludeId: number): Promise<User | null> {
    return this.userRepository
      .createQueryBuilder('user')
      .where('user.id != :excludeId', { excludeId })
      .orderBy('RAND()')
      .limit(1)
      .getOne();
  }

  private getMaxTerritories(level: number): number {
    if (level <= 5) return 3;
    if (level <= 10) return 5;
    if (level <= 20) return 8;
    if (level <= 30) return 12;
    if (level <= 50) return 18;
    return 25;
  }

  private calculateMatchBonus(userId: number, otherId: number): number {
    // 简化：随机返回匹配度
    const bonuses = [0, 10, 20, 30];
    return bonuses[Math.floor(Math.random() * bonuses.length)];
  }
}