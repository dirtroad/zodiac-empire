import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Robot } from './robot.entity';
import { User } from '../../entities/user.entity';

@Injectable()
export class RobotService {
  constructor(
    @InjectRepository(Robot)
    private robotRepository: Repository<Robot>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async trainRobot(userId: number, name: string, type: 'battle' | 'collection' | 'trade') {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new BadRequestException('用户不存在');

    // 检查机器人数量限制（最多 3 个）
    const count = await this.robotRepository.count({ where: { owner: { id: userId } } });
    if (count >= 3) {
      throw new BadRequestException('最多只能训练 3 个机器人');
    }

    // 消耗金币训练
    const trainCost = 1000;
    if (Number(user.gold) < trainCost) {
      throw new BadRequestException('金币不足，需要 1000 金币');
    }

    await this.userRepository.decrement({ id: userId }, 'gold', trainCost);

    const robot = this.robotRepository.create({
      owner: user,
      name,
      type,
      power: 100,
      attack: type === 'battle' ? 50 : 0,
      defense: type === 'battle' ? 30 : 0,
      collectionEfficiency: type === 'collection' ? 50 : 0,
      tradeSkill: type === 'trade' ? 50 : 0,
    });

    await this.robotRepository.save(robot);

    return {
      success: true,
      robot,
      message: `🤖 训练成功！${name}（${this.getTypeName(type)}）加入队伍！`,
    };
  }

  getTypeName(type: string): string {
    const map = { battle: '战斗型', collection: '采集型', trade: '贸易型' };
    return map[type] || type;
  }

  async getMyRobots(userId: number) {
    return this.robotRepository.find({
      where: { owner: { id: userId } },
      order: { createdAt: 'DESC' },
    });
  }

  async setAutoMode(userId: number, robotId: number, mode: 'battle' | 'collect' | 'trade', enabled: boolean) {
    const robot = await this.robotRepository.findOne({
      where: { id: robotId, owner: { id: userId } },
    });
    if (!robot) throw new BadRequestException('机器人不存在');

    if (mode === 'battle') robot.isAutoBattle = enabled;
    else if (mode === 'collect') robot.isAutoCollect = enabled;
    else if (mode === 'trade') robot.isAutoTrade = enabled;

    robot.lastActiveAt = new Date();
    await this.robotRepository.save(robot);

    return { success: true, message: `自动${this.getModeName(mode)}已${enabled ? '开启' : '关闭'}` };
  }

  getModeName(mode: string): string {
    const map = { battle: '战斗', collect: '采集', trade: '贸易' };
    return map[mode] || mode;
  }

  async upgradeRobot(userId: number, robotId: number) {
    const robot = await this.robotRepository.findOne({
      where: { id: robotId, owner: { id: userId } },
    });
    if (!robot) throw new BadRequestException('机器人不存在');

    const upgradeCost = 500 * robot.level;
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (Number(user.gold) < upgradeCost) {
      throw new BadRequestException(`金币不足，需要${upgradeCost}金币`);
    }

    await this.userRepository.decrement({ id: userId }, 'gold', upgradeCost);
    robot.level += 1;
    robot.power = Math.floor(robot.power * 1.2);
    robot.attack = Math.floor(robot.attack * 1.2);
    robot.defense = Math.floor(robot.defense * 1.2);
    robot.collectionEfficiency = Math.floor(robot.collectionEfficiency * 1.2);
    robot.tradeSkill = Math.floor(robot.tradeSkill * 1.2);

    await this.robotRepository.save(robot);

    return { success: true, robot, message: `🤖 ${robot.name}升级到 Lv.${robot.level}！` };
  }
}
