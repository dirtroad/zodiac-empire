import { Controller, Post, Get, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AwakeningService } from './awakening.service';

@ApiTags('ZodiacAwakening - 星座觉醒')
@Controller('zodiac-awakening')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class AwakeningController {
  constructor(private readonly awakeningService: AwakeningService) {}

  @Post('awaken')
  @ApiOperation({ summary: '星座觉醒' })
  async awaken(@Request() req: any) {
    return this.awakeningService.awaken(req.user.id);
  }

  @Get('status')
  @ApiOperation({ summary: '觉醒状态' })
  async getStatus(@Request() req: any) {
    return this.awakeningService.getAwakeningStatus(req.user.id);
  }
}
