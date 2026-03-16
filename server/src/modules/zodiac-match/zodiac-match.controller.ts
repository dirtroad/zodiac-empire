import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ZodiacMatchService } from './zodiac-match.service';

@ApiTags('ZodiacMatch - 星座匹配搜索')
@Controller('zodiac-match')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class ZodiacMatchController {
  constructor(private readonly service: ZodiacMatchService) {}

  @Post('search')
  @ApiOperation({ summary: '星座匹配搜索' })
  async search(@Request() req: any, @Body() body: { crystalCost?: number }) {
    return this.service.searchMatch(req.user.id, body.crystalCost || 30);
  }
}
