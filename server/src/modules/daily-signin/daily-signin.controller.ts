import { Controller, Post, Get, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { DailySigninService } from './daily-signin.service';

@ApiTags('DailySignin - 每日签到')
@Controller('daily-signin')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class DailySigninController {
  constructor(private readonly signinService: DailySigninService) {}

  @Post('checkin')
  @ApiOperation({ summary: '每日签到' })
  async checkin(@Request() req: any) {
    return this.signinService.checkin(req.user.id);
  }

  @Get('status')
  @ApiOperation({ summary: '查询签到状态' })
  async getSigninStatus(@Request() req: any) {
    return this.signinService.getSigninStatus(req.user.id);
  }
}
