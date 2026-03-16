import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { EmotionLiveService } from './emotion-live.service';

@ApiTags('EmotionLive - 情绪直播')
@Controller('emotion-live')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class EmotionLiveController {
  constructor(private readonly service: EmotionLiveService) {}

  @Post('start')
  @ApiOperation({ summary: '开启直播' })
  async start(@Request() req: any) {
    return this.service.startLive(req.user.id);
  }

  @Post('end')
  @ApiOperation({ summary: '结束直播' })
  async end(@Request() req: any) {
    return this.service.endLive(req.user.id);
  }

  @Post('gift')
  @ApiOperation({ summary: '送情绪礼物' })
  async gift(@Request() req: any, @Body() body: { targetId: number; emotionType: string; amount: number }) {
    return this.service.sendGift(req.user.id, body.targetId, body.emotionType, body.amount);
  }
}
