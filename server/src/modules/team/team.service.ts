import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Team } from '../../entities/team.entity';
import { TeamMember } from '../../entities/team-member.entity';
import { User } from '../../entities/user.entity';
import { CreateTeamDto } from './dto/create-team.dto';

@Injectable()
export class TeamService {
  constructor(
    @InjectRepository(Team)
    private teamRepository: Repository<Team>,
    @InjectRepository(TeamMember)
    private memberRepository: Repository<TeamMember>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // 创建战队
  async createTeam(userId: number, dto: CreateTeamDto) {
    // 检查用户是否已有战队
    const existingMember = await this.memberRepository.findOne({
      where: { userId },
    });
    if (existingMember) {
      throw new BadRequestException('你已经加入了一个战队');
    }

    // 创建战队
    const team = this.teamRepository.create({
      name: dto.name,
      leaderId: userId,
      description: dto.description,
      memberCount: 1,
      maxMembers: dto.maxMembers || 5,
    });
    await this.teamRepository.save(team);

    // 添加队长为成员
    const member = this.memberRepository.create({
      teamId: team.id,
      userId,
      role: 1, // 队长
      position: 1,
    });
    await this.memberRepository.save(member);

    return this.getTeamDetail(team.id);
  }

  // 获取我的战队信息
  async getMyTeam(userId: number) {
    const member = await this.memberRepository.findOne({
      where: { userId },
    });
    if (!member) {
      return null;
    }
    return this.getTeamDetail(member.teamId);
  }

  // 获取战队详情
  async getTeamDetail(id: number) {
    const team = await this.teamRepository.findOne({ where: { id } });
    if (!team) {
      throw new NotFoundException('战队不存在');
    }

    const members = await this.getTeamMembers(id);
    const leader = await this.userRepository.findOne({
      where: { id: team.leaderId },
      select: ['id', 'nickname', 'avatarUrl', 'power', 'zodiacSign'],
    });

    return {
      ...team,
      leader,
      members,
      winRate: team.wins + team.losses > 0
        ? Math.round(team.wins / (team.wins + team.losses) * 100)
        : 0,
    };
  }

  // 获取战队成员列表
  async getTeamMembers(teamId: number) {
    const members = await this.memberRepository.find({
      where: { teamId },
      order: { position: 'ASC' },
    });

    const userIds = members.map(m => m.userId);
    const users = await this.userRepository.findByIds(userIds);

    return members.map(m => {
      const user = users.find(u => u.id === m.userId);
      return {
        id: m.id,
        userId: m.userId,
        role: m.role,
        position: m.position,
        contribution: m.contribution,
        matchBonus: m.matchBonus,
        battles: m.battles,
        wins: m.wins,
        user: {
          id: user?.id,
          nickname: user?.nickname,
          avatarUrl: user?.avatarUrl,
          power: user?.power,
          zodiacSign: user?.zodiacSign,
          zodiacName: user?.zodiacName,
        },
      };
    });
  }

  // 加入战队
  async joinTeam(userId: number, teamId: number) {
    // 检查是否已加入其他战队
    const existingMember = await this.memberRepository.findOne({
      where: { userId },
    });
    if (existingMember) {
      throw new BadRequestException('你已经加入了一个战队');
    }

    const team = await this.teamRepository.findOne({ where: { id: teamId } });
    if (!team) {
      throw new NotFoundException('战队不存在');
    }

    if (team.memberCount >= team.maxMembers) {
      throw new BadRequestException('战队成员已满');
    }

    // 添加成员
    const member = this.memberRepository.create({
      teamId,
      userId,
      role: 2, // 成员
      position: team.memberCount + 1,
    });
    await this.memberRepository.save(member);

    // 更新战队成员数
    team.memberCount += 1;
    await this.teamRepository.save(team);

    return { success: true, message: '加入成功' };
  }

  // 离开战队
  async leaveTeam(userId: number) {
    const member = await this.memberRepository.findOne({
      where: { userId },
    });
    if (!member) {
      throw new NotFoundException('你还没有加入战队');
    }

    if (member.role === 1) {
      throw new BadRequestException('队长不能直接离开，请转让队长或解散战队');
    }

    const team = await this.teamRepository.findOne({
      where: { id: member.teamId },
    });

    // 移除成员
    await this.memberRepository.remove(member);

    // 更新战队成员数
    if (team) {
      team.memberCount -= 1;
      await this.teamRepository.save(team);
    }

    return { success: true, message: '已离开战队' };
  }

  // 踢出成员
  async kickMember(leaderId: number, teamId: number, userId: number) {
    const team = await this.teamRepository.findOne({ where: { id: teamId } });
    if (!team || team.leaderId !== leaderId) {
      throw new ForbiddenException('只有队长可以踢出成员');
    }

    const member = await this.memberRepository.findOne({
      where: { teamId, userId },
    });
    if (!member) {
      throw new NotFoundException('成员不存在');
    }

    if (member.role === 1) {
      throw new BadRequestException('不能踢出队长');
    }

    await this.memberRepository.remove(member);
    team.memberCount -= 1;
    await this.teamRepository.save(team);

    return { success: true, message: '已踢出成员' };
  }

  // 解散战队
  async dissolveTeam(leaderId: number, teamId: number) {
    const team = await this.teamRepository.findOne({ where: { id: teamId } });
    if (!team || team.leaderId !== leaderId) {
      throw new ForbiddenException('只有队长可以解散战队');
    }

    // 移除所有成员
    await this.memberRepository.delete({ teamId });

    // 删除战队
    team.status = 2; // 已解散
    await this.teamRepository.save(team);

    return { success: true, message: '战队已解散' };
  }

  // 转让队长
  async transferLeader(leaderId: number, teamId: number, newLeaderId: number) {
    const team = await this.teamRepository.findOne({ where: { id: teamId } });
    if (!team || team.leaderId !== leaderId) {
      throw new ForbiddenException('只有队长可以转让');
    }

    const newLeaderMember = await this.memberRepository.findOne({
      where: { teamId, userId: newLeaderId },
    });
    if (!newLeaderMember) {
      throw new NotFoundException('该玩家不在战队中');
    }

    // 更新原队长角色
    const oldLeaderMember = await this.memberRepository.findOne({
      where: { teamId, userId: leaderId },
    });
    if (oldLeaderMember) {
      oldLeaderMember.role = 2;
      await this.memberRepository.save(oldLeaderMember);
    }

    // 更新新队长
    newLeaderMember.role = 1;
    await this.memberRepository.save(newLeaderMember);

    team.leaderId = newLeaderId;
    await this.teamRepository.save(team);

    return { success: true, message: '转让成功' };
  }

  // 战队排行榜
  async getRanking(limit: number) {
    const safeLimit = Math.max(1, Math.min(100, limit || 50));
    return this.teamRepository
      .createQueryBuilder('team')
      .where('team.status = :status', { status: 1 })
      .orderBy('team.score', 'DESC')
      .addOrderBy('team.totalPower', 'DESC')
      .limit(safeLimit)
      .getMany();
  }

  // 搜索战队
  async searchTeam(keyword: string) {
    if (!keyword || keyword.length < 1) {
      return [];
    }

    return this.teamRepository
      .createQueryBuilder('team')
      .where('team.status = :status', { status: 1 })
      .andWhere('team.name LIKE :keyword', { keyword: `%${keyword}%` })
      .orderBy('team.score', 'DESC')
      .limit(20)
      .getMany();
  }

  // 计算战队匹配加成
  async calculateMatchBonus(teamId: number) {
    const members = await this.memberRepository.find({
      where: { teamId },
    });

    if (members.length < 2) {
      return { bonus: 0, details: '成员不足，无加成' };
    }

    // 获取所有成员的星座
    const userIds = members.map(m => m.userId);
    const users = await this.userRepository.findByIds(userIds);

    // 按元素分组
    const elementCounts: Record<string, number> = {};
    users.forEach(u => {
      if (u.zodiacSign) {
        const element = this.getZodiacElement(u.zodiacSign);
        elementCounts[element] = (elementCounts[element] || 0) + 1;
      }
    });

    // 计算加成（同元素越多加成越高）
    let maxSameElement = 0;
    let dominantElement = '';
    for (const [element, count] of Object.entries(elementCounts)) {
      if (count > maxSameElement) {
        maxSameElement = count;
        dominantElement = element;
      }
    }

    // 加成计算：每个同元素成员+5%
    const bonus = maxSameElement >= 2 ? (maxSameElement - 1) * 5 : 0;

    return {
      bonus,
      dominantElement,
      elementCounts,
      details: bonus > 0
        ? `${dominantElement}象星座×${maxSameElement}，战力加成+${bonus}%`
        : '成员星座分散，无加成',
    };
  }

  // 获取星座元素
  private getZodiacElement(zodiac: number): string {
    const elements: Record<number, string> = {
      1: '火', 5: '火', 9: '火',     // 白羊、狮子、射手
      2: '土', 6: '土', 10: '土',    // 金牛、处女、摩羯
      3: '风', 7: '风', 11: '风',    // 双子、天秤、水瓶
      4: '水', 8: '水', 12: '水',    // 巨蟹、天蝎、双鱼
    };
    return elements[zodiac] || '未知';
  }
}