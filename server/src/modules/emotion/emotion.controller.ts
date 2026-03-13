import { Controller, Get, Post, Body, Request, Query, Param } from '@nestjs/common';
import { EmotionService } from './emotion.service';
import { UploadCardDto } from './dto/upload-card.dto';
import { Public } from '../auth/decorators/public.decorator';

@Controller('emotion')
export class EmotionController {
  constructor(private readonly emotionService: EmotionService) {}

  // 获取用户情绪资源
  @Get('resources')
  async getEmotionResources(@Request() req: any) {
    return this.emotionService.getEmotionResources(req.user.userId);
  }

  // 收取情绪资源
  @Post('collect')
  async collectEmotion(@Request() req: any, @Body('emotionType') emotionType: number) {
    return this.emotionService.collectEmotion(req.user.userId, emotionType);
  }

  // 使用情绪强化修炼
  @Post('use')
  async useEmotion(@Request() req: any, @Body('emotionType') emotionType: number, @Body('amount') amount: number) {
    return this.emotionService.useEmotionForCultivation(req.user.userId, emotionType, amount || 10);
  }

  // 上传情绪卡片
  @Post('cards')
  async uploadCard(@Request() req: any, @Body() dto: UploadCardDto) {
    return this.emotionService.uploadCard(req.user.userId, dto);
  }

  // 获取情绪卡片列表（广场）
  @Public()
  @Get('cards')
  async getCards(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
    @Query('orderBy') orderBy: string = 'popularity',
  ) {
    return this.emotionService.getCards(parseInt(page, 10) || 1, parseInt(limit, 10) || 20, orderBy);
  }

  // 获取我的情绪卡片
  @Get('cards/my')
  async getMyCards(@Request() req: any) {
    return this.emotionService.getMyCards(req.user.userId);
  }

  // 获取卡片详情
  @Public()
  @Get('cards/:id')
  async getCardDetail(@Param('id') id: number) {
    return this.emotionService.getCardDetail(id);
  }

  // 点赞/踩
  @Post('cards/:id/vote')
  async voteCard(
    @Request() req: any,
    @Param('id') cardId: number,
    @Body('voteType') voteType: number,
  ) {
    return this.emotionService.voteCard(req.user.userId, cardId, voteType);
  }

  // 领取卡片奖励
  @Post('cards/:id/collect')
  async collectCardReward(@Request() req: any, @Param('id') cardId: number) {
    return this.emotionService.collectCardReward(req.user.userId, cardId);
  }

  // 情绪类型配置
  @Public()
  @Get('types')
  async getEmotionTypes() {
    return this.emotionService.getEmotionTypes();
  }
}