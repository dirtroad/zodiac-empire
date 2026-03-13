import { Controller, Get, Post, Delete, Body, Param, Request, Query } from '@nestjs/common';
import { TeamService } from './team.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { Public } from '../auth/decorators/public.decorator';

@Controller('team')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  // 战队排行榜 - 放在最前面避免被:id拦截
  @Public()
  @Get('ranking')
  async getRanking(@Query('limit') limit: string = '50') {
    return this.teamService.getRanking(parseInt(limit, 10) || 50);
  }

  // 搜索战队 - 放在:id前面
  @Public()
  @Get('search')
  async searchTeam(@Query('keyword') keyword: string) {
    return this.teamService.searchTeam(keyword || '');
  }

  // 获取我的战队信息
  @Get('my')
  async getMyTeam(@Request() req: any) {
    return this.teamService.getMyTeam(req.user.userId);
  }

  // 创建战队
  @Post('create')
  async createTeam(@Request() req: any, @Body() dto: CreateTeamDto) {
    return this.teamService.createTeam(req.user.userId, dto);
  }

  // 离开战队
  @Post('leave')
  async leaveTeam(@Request() req: any) {
    return this.teamService.leaveTeam(req.user.userId);
  }

  // 获取战队详情
  @Public()
  @Get(':id')
  async getTeamDetail(@Param('id') teamId: string) {
    return this.teamService.getTeamDetail(parseInt(teamId, 10) || 0);
  }

  // 获取战队成员列表
  @Public()
  @Get(':id/members')
  async getTeamMembers(@Param('id') teamId: string) {
    return this.teamService.getTeamMembers(parseInt(teamId, 10) || 0);
  }

  // 计算战队匹配加成
  @Public()
  @Get(':id/match-bonus')
  async calculateMatchBonus(@Param('id') teamId: string) {
    return this.teamService.calculateMatchBonus(parseInt(teamId, 10) || 0);
  }

  // 加入战队
  @Post(':id/join')
  async joinTeam(@Request() req: any, @Param('id') teamId: string) {
    return this.teamService.joinTeam(req.user.userId, parseInt(teamId, 10) || 0);
  }

  // 踢出成员
  @Delete(':id/members/:userId')
  async kickMember(
    @Request() req: any,
    @Param('id') teamId: string,
    @Param('userId') userId: string,
  ) {
    return this.teamService.kickMember(
      req.user.userId,
      parseInt(teamId, 10) || 0,
      parseInt(userId, 10) || 0,
    );
  }

  // 解散战队
  @Delete(':id')
  async dissolveTeam(@Request() req: any, @Param('id') teamId: string) {
    return this.teamService.dissolveTeam(req.user.userId, parseInt(teamId, 10) || 0);
  }

  // 转让队长
  @Post(':id/transfer')
  async transferLeader(
    @Request() req: any,
    @Param('id') teamId: string,
    @Body('newLeaderId') newLeaderId: number,
  ) {
    return this.teamService.transferLeader(req.user.userId, parseInt(teamId, 10) || 0, newLeaderId);
  }
}