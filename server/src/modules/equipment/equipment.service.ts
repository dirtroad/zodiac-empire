import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEquipment } from '../../entities/user-equipment.entity';
import { EquipmentTemplate } from '../../entities/equipment-template.entity';
import { User } from '../../entities/user.entity';

@Injectable()
export class EquipmentService {
  constructor(
    @InjectRepository(UserEquipment)
    private userEquipmentRepository: Repository<UserEquipment>,
    @InjectRepository(EquipmentTemplate)
    private templateRepository: Repository<EquipmentTemplate>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findByUserId(userId: number): Promise<UserEquipment[]> {
    return this.userEquipmentRepository.find({
      where: { userId },
      order: { isEquipped: 'DESC', rarity: 'DESC', createdAt: 'DESC' },
    });
  }

  async findById(id: number, userId: number): Promise<UserEquipment> {
    const equipment = await this.userEquipmentRepository.findOne({
      where: { id, userId },
    });
    if (!equipment) {
      throw new NotFoundException('装备不存在');
    }
    return equipment;
  }

  async getAllTemplates(): Promise<EquipmentTemplate[]> {
    return this.templateRepository.find({ order: { rarity: 'ASC', type: 'ASC' } });
  }

  async equip(userId: number, equipmentId: number, slot: number): Promise<UserEquipment> {
    const equipment = await this.findById(equipmentId, userId);
    
    // 卸下当前槽位的装备
    await this.userEquipmentRepository.update(
      { userId, equippedSlot: slot },
      { isEquipped: false, equippedSlot: null },
    );

    equipment.isEquipped = true;
    equipment.equippedSlot = slot;
    return this.userEquipmentRepository.save(equipment);
  }

  async unequip(userId: number, equipmentId: number): Promise<UserEquipment> {
    const equipment = await this.findById(equipmentId, userId);
    equipment.isEquipped = false;
    equipment.equippedSlot = null;
    return this.userEquipmentRepository.save(equipment);
  }

  async upgrade(id: number, userId: number): Promise<UserEquipment> {
    const equipment = await this.findById(id, userId);
    const user = await this.userRepository.findOne({ where: { id: userId } });
    
    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    const cost = Math.floor(100 * Math.pow(2, equipment.level));
    if (user.gold < cost) {
      throw new ForbiddenException('金币不足');
    }

    equipment.level += 1;
    equipment.currentPower = Math.floor(equipment.currentPower * 1.1);

    await this.userRepository.update(userId, { gold: user.gold - cost });
    return this.userEquipmentRepository.save(equipment);
  }

  async gacha(userId: number, count: number): Promise<UserEquipment[]> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    
    if (!user) {
      throw new NotFoundException('用户不存在');
    }
    
    const cost = 500 * count; // 每次抽卡 500 金币

    if (Number(user.gold) < cost) {
      throw new ForbiddenException('金币不足');
    }

    // 扣除金币
    user.gold = (Number(user.gold) - cost) as any;

    const templates = await this.templateRepository.find();
    const results: UserEquipment[] = [];

    for (let i = 0; i < count; i++) {
      // 首抽保底稀有（前 5 抽至少 1 个稀有）
      let rarity = 1;
      const totalPulls = (user.gachaPullCount || 0) + i + 1;
      
      if (totalPulls <= 5) {
        // 前 5 抽保底逻辑：如果前 4 抽都是普通，第 5 抽必出稀有
        const hasRareOrBetter = results.some(r => r.rarity >= 2);
        if (totalPulls === 5 && !hasRareOrBetter) {
          rarity = 2; // 保底稀有
        } else {
          // 正常概率
          const rand = Math.random();
          if (rand > 0.95) rarity = 4;      // 5% 传说
          else if (rand > 0.85) rarity = 3;  // 10% 史诗
          else if (rand > 0.70) rarity = 2;  // 15% 稀有
          // 70% 普通
        }
      } else {
        // 正常概率
        const rand = Math.random();
        if (rand > 0.95) rarity = 4;      // 5% 传说
        else if (rand > 0.85) rarity = 3;  // 10% 史诗
        else if (rand > 0.70) rarity = 2;  // 15% 稀有
        // 70% 普通
      }

      const filteredTemplates = templates.filter(t => t.rarity === rarity);
      const template = filteredTemplates[Math.floor(Math.random() * filteredTemplates.length)];

      if (template) {
        const equipment = this.userEquipmentRepository.create({
          userId,
          equipmentId: template.id,
          name: template.name,
          type: template.type,
          rarity: template.rarity,
          level: 1,
          currentPower: template.basePower,
          isEquipped: false,
        });
        results.push(await this.userEquipmentRepository.save(equipment));
      }
    }

    // 更新抽卡次数
    user.gachaPullCount = (user.gachaPullCount || 0) + count;
    await this.userRepository.save(user);

    return results;
  }

  async fixTemplates() {
    const fixes = [
      { id: 1, name: '星辰之剑', description: '普通的星辰之剑' },
      { id: 2, name: '月光护盾', description: '普通的月光护盾' },
      { id: 3, name: '烈焰长矛', description: '稀有的烈焰长矛' },
      { id: 4, name: '冰霜法杖', description: '稀有的冰霜法杖' },
      { id: 5, name: '暗影匕首', description: '稀有的暗影匕首' },
      { id: 6, name: '雷霆战锤', description: '史诗的雷霆战锤' },
      { id: 7, name: '圣光法典', description: '史诗的圣光法典' },
      { id: 8, name: '龙吟神剑', description: '传说的龙吟神剑' },
      { id: 9, name: '永恒之心', description: '传说的永恒之心' },
    ];

    for (const fix of fixes) {
      const template = await this.templateRepository.findOne({ where: { id: fix.id } });
      if (template) {
        template.name = fix.name;
        template.description = fix.description;
        await this.templateRepository.save(template);
      }
    }

    return { success: true, message: '装备模板已修复' };
  }
}
