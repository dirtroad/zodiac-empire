import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { CrystalMineService } from './crystal-mine.service';

@ApiTags('CrystalMine - 时空晶体矿')
@Controller('crystal-mine')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class CrystalMineController {
  constructor(private readonly mineService: CrystalMineService) {}

  @Post('mine')
  @ApiOperation({ summary: '采矿' })
  async mine(@Request() req: any) {
    return this.mineService.mine(req.user.id);
  }

  @Get('status')
  @ApiOperation({ summary: '采矿状态' })
  async getStatus(@Request() req: any) {
    return this.mineService.getMineStatus(req.user.id);
  }

  @Post('boost')
  @ApiOperation({ summary: '提升产量' })
  async boost(@Request() req: any, @Body() body: { amount: number }) {
    return this.mineService.boostProductivity(req.user.id, body.amount);
  }
}
