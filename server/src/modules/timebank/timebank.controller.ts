import { Controller, Get, Post, Body, Request } from '@nestjs/common';
import { TimebankService } from './timebank.service';
import { UseCrystalDto } from './dto/use-crystal.dto';

@Controller('time-crystal')
export class TimebankController {
  constructor(private readonly timebankService: TimebankService) {}

  @Get('balance')
  async getBalance(@Request() req: any) {
    return this.timebankService.getBalance(req.user.userId);
  }

  @Get('logs')
  async getLogs(@Request() req: any) {
    return this.timebankService.getLogs(req.user.userId);
  }

  @Post('use')
  async useCrystal(@Request() req: any, @Body() dto: UseCrystalDto) {
    return this.timebankService.useCrystal(req.user.userId, dto);
  }

  @Post('warp')
  async timeWarp(@Request() req: any, @Body('targetRealm') targetRealm: number) {
    return this.timebankService.timeWarp(req.user.userId, targetRealm);
  }

  @Post('travel')
  async travel(@Request() req: any, @Body('destination') destination: string, @Body('cost') cost: number) {
    return this.timebankService.travel(req.user.userId, destination, cost);
  }

  @Post('search-match')
  async searchMatch(@Request() req: any) {
    return this.timebankService.searchConstellationMatch(req.user.userId);
  }
}