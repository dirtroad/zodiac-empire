import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { GalaxyService } from './galaxy.service';
import { CreateGalaxyDto } from './dto/create-galaxy.dto';

@ApiTags('星系')
@ApiBearerAuth()
@Controller('galaxies')
export class GalaxyController {
  constructor(private readonly galaxyService: GalaxyService) {}

  @Get()
  @ApiOperation({ summary: '获取我的星系列表' })
  async getMyGalaxies(@Request() req: any) {
    return this.galaxyService.findByUserId(req.user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取星系详情' })
  async getGalaxy(@Request() req: any, @Body('id') id: number) {
    return this.galaxyService.findById(id, req.user.userId);
  }

  @Post()
  @ApiOperation({ summary: '创建新星系' })
  async createGalaxy(@Request() req: any, @Body() dto: CreateGalaxyDto) {
    return this.galaxyService.create(req.user.userId, dto);
  }

  @Post(':id/upgrade')
  @ApiOperation({ summary: '升级星系' })
  async upgradeGalaxy(@Request() req: any, @Body('id') id: number) {
    return this.galaxyService.upgrade(id, req.user.userId);
  }

  @Post(':id/collect')
  @ApiOperation({ summary: '收集星系资源' })
  async collectResources(@Request() req: any, @Body('id') id: number) {
    return this.galaxyService.collectResources(id, req.user.userId);
  }
}