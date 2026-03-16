import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { WeddingService } from './wedding.service';

@ApiTags('Wedding - 星际婚礼')
@Controller('wedding')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class WeddingController {
  constructor(private readonly weddingService: WeddingService) {}

  @Post('propose')
  @ApiOperation({ summary: '求婚' })
  async propose(@Request() req: any, @Body() body: { targetId: number }) {
    return this.weddingService.propose(req.user.id, body.targetId);
  }

  @Post('accept')
  @ApiOperation({ summary: '接受求婚' })
  async accept(@Request() req: any, @Body() body: { proposerId: number; weddingType: 'basic' | 'luxury' }) {
    return this.weddingService.acceptProposal(req.user.id, body.proposerId, body.weddingType);
  }

  @Get('status')
  @ApiOperation({ summary: '婚姻状态' })
  async getStatus(@Request() req: any) {
    return this.weddingService.getWeddingStatus(req.user.id);
  }

  @Post('divorce')
  @ApiOperation({ summary: '离婚' })
  async divorce(@Request() req: any) {
    return this.weddingService.divorce(req.user.id);
  }
}
