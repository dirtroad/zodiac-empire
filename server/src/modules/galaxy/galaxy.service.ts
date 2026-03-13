import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Galaxy } from '../../entities/galaxy.entity';
import { User } from '../../entities/user.entity';
import { CreateGalaxyDto } from './dto/create-galaxy.dto';

@Injectable()
export class GalaxyService {
  constructor(
    @InjectRepository(Galaxy)
    private galaxyRepository: Repository<Galaxy>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findByUserId(userId: number): Promise<Galaxy[]> {
    return this.galaxyRepository.find({
      where: { userId },
      order: { isMain: 'DESC', createdAt: 'ASC' },
    });
  }

  async findById(id: number, userId: number): Promise<Galaxy> {
    const galaxy = await this.galaxyRepository.findOne({
      where: { id, userId },
    });
    if (!galaxy) {
      throw new NotFoundException('星系不存在');
    }
    return galaxy;
  }

  async create(userId: number, dto: CreateGalaxyDto): Promise<Galaxy> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    
    if (!user) {
      throw new NotFoundException('用户不存在');
    }
    
    // 计算创建费用
    const galaxyCount = await this.galaxyRepository.count({ where: { userId } });
    const cost = Math.floor(1000 * Math.pow(1.5, galaxyCount));
    
    if (user.gold < cost) {
      throw new ForbiddenException('金币不足');
    }

    const galaxy = this.galaxyRepository.create({
      userId,
      name: dto.name || `星系${galaxyCount + 1}`,
      type: dto.type || 1,
      rarity: Math.floor(Math.random() * 4) + 1,
      size: Math.floor(Math.random() * 5) + 1,
      isMain: galaxyCount === 0,
    });

    await this.userRepository.update(userId, { gold: user.gold - cost });
    return this.galaxyRepository.save(galaxy);
  }

  async upgrade(id: number, userId: number): Promise<Galaxy> {
    const galaxy = await this.findById(id, userId);
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    const cost = Math.floor(500 * Math.pow(2, galaxy.level));
    if (user.gold < cost) {
      throw new ForbiddenException('金币不足');
    }

    galaxy.level += 1;
    galaxy.baseProduction = Math.floor(galaxy.baseProduction * 1.2);
    galaxy.defensePower = Math.floor(galaxy.defensePower * 1.1);

    await this.userRepository.update(userId, { gold: user.gold - cost });
    return this.galaxyRepository.save(galaxy);
  }

  async collectResources(id: number, userId: number): Promise<{ gold: number }> {
    const galaxy = await this.findById(id, userId);
    
    // 简化计算：每次收集基础产量 * 等级
    const goldEarned = Math.floor(galaxy.baseProduction * galaxy.level);
    
    await this.userRepository.increment({ id: userId }, 'gold', goldEarned);
    
    return { gold: goldEarned };
  }
}