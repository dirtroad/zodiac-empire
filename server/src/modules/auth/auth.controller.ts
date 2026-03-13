import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { WechatLoginDto } from './dto/wechat-login.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Public } from './decorators/public.decorator';

@ApiTags('认证')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('wechat/login')
  @ApiOperation({ summary: '微信登录', description: '通过微信code登录，开发环境可用test作为code' })
  async wechatLogin(@Body() loginDto: WechatLoginDto) {
    return this.authService.wechatLogin(loginDto);
  }

  @Public()
  @Post('refresh')
  @ApiOperation({ summary: '刷新Token' })
  async refresh(@Request() req: any) {
    return { message: 'Token refreshed' };
  }
}