import { Controller, Get, Post, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { DungeonService } from './dungeon.service';

@ApiTags('副本')
@ApiBearerAuth()
@Controller('dungeon')
export class DungeonController {
  constructor(private readonly dungeonService: DungeonService) {}

  @Post('slum/challenge')
  @ApiOperation({ summary: '挑战贫民窟副本（无限刷金币）' })
  async challengeSlum(@Request() req: any) {
    return this.dungeonService.challengeSlum(req.user.userId);
  }

  @Post('slum/reset')
  @ApiOperation({ summary: '重置贫民窟连胜' })
  async resetWinStreak(@Request() req: any) {
    return this.dungeonService.resetWinStreak(req.user.userId);
  }
}
