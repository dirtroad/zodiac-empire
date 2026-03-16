import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { TutorialService } from './tutorial.service';

@ApiTags('Tutorial - 新手引导')
@Controller('tutorial')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class TutorialController {
  constructor(private readonly tutorialService: TutorialService) {}

  @Get('status')
  @ApiOperation({ summary: '获取引导状态' })
  async getStatus(@Request() req: any) {
    return this.tutorialService.getTutorialStatus(req.user.id);
  }

  @Post('complete')
  @ApiOperation({ summary: '完成引导步骤' })
  async complete(@Request() req: any, @Body() body: { step: number }) {
    return this.tutorialService.completeStep(req.user.id, body.step);
  }
}
