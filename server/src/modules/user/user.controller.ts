import { Controller, Get, Post, Body, Param, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UserService } from './user.service';

@ApiTags('用户')
@ApiBearerAuth()
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @ApiOperation({ summary: '获取当前用户信息' })
  async getCurrentUser(@Request() req: any) {
    return this.userService.getUserInfo(req.user.userId);
  }

  @Post('zodiac')
  @ApiOperation({ summary: '设置用户星座' })
  async setZodiac(@Request() req: any, @Body('zodiacSign') zodiacSign: number) {
    return this.userService.setZodiacSign(req.user.userId, zodiacSign);
  }

  @Post('upgrade-power')
  @ApiOperation({ summary: '修炼提升，消耗金币增加战力' })
  async upgradePower(@Request() req: any) {
    return this.userService.upgradePower(req.user.userId);
  }

  @Post('heartbeat')
  @ApiOperation({ summary: '在线心跳，累计在线时长' })
  async heartbeat(@Request() req: any) {
    return this.userService.updateOnlineTime(req.user.userId);
  }

  @Post('bank/deposit')
  @ApiOperation({ summary: '存入时空银行' })
  async depositTimeCoin(@Request() req: any, @Body('amount') amount: number) {
    return this.userService.depositTimeCoin(req.user.userId, amount);
  }

  @Post('bank/withdraw')
  @ApiOperation({ summary: '从时空银行取出' })
  async withdrawTimeCoin(@Request() req: any, @Body('amount') amount: number) {
    return this.userService.withdrawTimeCoin(req.user.userId, amount);
  }

  @Get('bank')
  @ApiOperation({ summary: '获取时空银行信息' })
  async getBankInfo(@Request() req: any) {
    return this.userService.getBankInfo(req.user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取指定用户信息' })
  async getUser(@Param('id') id: string) {
    return this.userService.getUserInfo(parseInt(id, 10));
  }

  @Post('bankruptcy-check')
  @ApiOperation({ summary: '破产保护检查（金币<500 时触发救济）' })
  async checkBankruptcy(@Request() req: any) {
    return this.userService.checkBankruptcyProtection(req.user.userId);
  }
}