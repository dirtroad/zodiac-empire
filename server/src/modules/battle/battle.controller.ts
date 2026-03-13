import { Controller, Get, Post, Body, Request } from '@nestjs/common';
import { BattleService } from './battle.service';
import { StartBattleDto } from './dto/start-battle.dto';
import { Public } from '../auth/decorators/public.decorator';

@Controller('battle')
export class BattleController {
  constructor(private readonly battleService: BattleService) {}

  @Get('history')
  async getBattleHistory(@Request() req: any) {
    return this.battleService.getHistory(req.user.userId);
  }

  @Post('start')
  async startBattle(@Request() req: any, @Body() dto: StartBattleDto) {
    return this.battleService.startBattle(req.user.userId, dto.targetId);
  }

  @Post('execute')
  async executeBattle(@Request() req: any, @Body('battleId') battleId: number) {
    return this.battleService.executeBattle(battleId, req.user.userId);
  }

  @Public()
  @Get('ranking')
  async getRanking(@Request() req: any) {
    return this.battleService.getRanking();
  }
}