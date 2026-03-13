import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { EquipmentService } from './equipment.service';
import { EquipDto } from './dto/equip.dto';

@Controller('equipment')
export class EquipmentController {
  constructor(private readonly equipmentService: EquipmentService) {}

  @Get('my')
  async getMyEquipment(@Request() req: any) {
    return this.equipmentService.findByUserId(req.user.userId);
  }

  @Get('templates')
  async getTemplates() {
    return this.equipmentService.getAllTemplates();
  }

  @Get(':id')
  async getEquipment(@Request() req: any, @Param('id') id: string) {
    return this.equipmentService.findById(parseInt(id, 10), req.user.userId);
  }

  @Post('equip')
  async equip(@Request() req: any, @Body() dto: EquipDto) {
    return this.equipmentService.equip(req.user.userId, dto.equipmentId, dto.slot);
  }

  @Post('unequip')
  async unequip(@Request() req: any, @Body('equipmentId') equipmentId: number) {
    return this.equipmentService.unequip(req.user.userId, equipmentId);
  }

  @Post(':id/upgrade')
  async upgrade(@Request() req: any, @Param('id') id: string) {
    return this.equipmentService.upgrade(parseInt(id, 10), req.user.userId);
  }

  @Post('gacha')
  async gacha(@Request() req: any, @Body('count') count: number = 1) {
    return this.equipmentService.gacha(req.user.userId, count);
  }

  @Post('fix-templates')
  async fixTemplates() {
    return this.equipmentService.fixTemplates();
  }
}