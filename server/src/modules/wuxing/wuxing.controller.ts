import { Controller, Get, Post, Body, Request, HttpException, HttpStatus } from '@nestjs/common';
import { WuxingService } from './wuxing.service';
import { SetWuxingDto } from './dto/set-wuxing.dto';
import { Public } from '../auth/decorators/public.decorator';

@Controller('wuxing')
export class WuxingController {
  constructor(private readonly wuxingService: WuxingService) {}

  @Public()
  @Get()
  async getMyWuxing(@Request() req: any) {
    if (!req.user) {
      throw new HttpException('未登录', HttpStatus.UNAUTHORIZED);
    }
    return this.wuxingService.getByUserId(req.user.userId);
  }

  @Post('set')
  async setWuxing(@Request() req: any, @Body() dto: SetWuxingDto) {
    return this.wuxingService.setWuxing(req.user.userId, dto);
  }

  @Public()
  @Get('relations')
  async getRelations() {
    return this.wuxingService.getWuxingRelations();
  }

  @Post('calculate')
  async calculateBonus(@Request() req: any, @Body('targetUserId') targetUserId: number) {
    return this.wuxingService.calculateRelationBonus(req.user.userId, targetUserId);
  }
}