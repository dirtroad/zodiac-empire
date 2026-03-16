import { Controller, Post, Get, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { WandererUnionService } from './wanderer-union.service';

@ApiTags('WandererUnion - 流浪者工会')
@Controller('wanderer-union')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class WandererUnionController {
  constructor(private readonly service: WandererUnionService) {}

  @Post('join')
  @ApiOperation({ summary: '加入工会' })
  async join(@Request() req: any) {
    return this.service.joinUnion(req.user.id);
  }

  @Get('members')
  @ApiOperation({ summary: '工会成员列表' })
  async getMembers(@Request() req: any) {
    return this.service.getUnionMembers(req.user.id);
  }

  @Post('leave')
  @ApiOperation({ summary: '退出工会' })
  async leave(@Request() req: any) {
    return this.service.leaveUnion(req.user.id);
  }

  @Post('attack')
  @ApiOperation({ summary: '工会集体攻击' })
  async attack(@Request() req: any) {
    return this.service.unionAttack(req.user.id, 0);
  }
}
