import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RobotService } from './robot.service';

@ApiTags('Robot - AI 机器人')
@Controller('robot')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class RobotController {
  constructor(private readonly robotService: RobotService) {}

  @Post('train')
  @ApiOperation({ summary: '训练机器人' })
  async train(@Request() req: any, @Body() body: { name: string; type: 'battle' | 'collection' | 'trade' }) {
    return this.robotService.trainRobot(req.user.id, body.name, body.type);
  }

  @Get('my')
  @ApiOperation({ summary: '我的机器人列表' })
  async getMyRobots(@Request() req: any) {
    return this.robotService.getMyRobots(req.user.id);
  }

  @Post('auto')
  @ApiOperation({ summary: '设置自动模式' })
  async setAuto(@Request() req: any, @Body() body: { robotId: number; mode: 'battle' | 'collect' | 'trade'; enabled: boolean }) {
    return this.robotService.setAutoMode(req.user.id, body.robotId, body.mode, body.enabled);
  }

  @Post('upgrade')
  @ApiOperation({ summary: '升级机器人' })
  async upgrade(@Request() req: any, @Body() body: { robotId: number }) {
    return this.robotService.upgradeRobot(req.user.id, body.robotId);
  }
}
