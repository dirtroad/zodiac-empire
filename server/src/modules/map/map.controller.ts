import { Controller, Get, Post, Body, Request, Query, Param } from '@nestjs/common';
import { MapService } from './map.service';

@Controller('map')
export class MapController {
  constructor(private readonly mapService: MapService) {}

  @Get('local')
  async getLocalMap(@Request() req: any, @Query('lat') lat: number, @Query('lng') lng: number) {
    return this.mapService.getLocalMap(req.user.userId, lat, lng);
  }

  @Get('constellation')
  async getConstellationMap(@Request() req: any) {
    return this.mapService.getConstellationMap(req.user.userId);
  }

  @Get('realm/:id')
  async getRealmDetail(@Request() req: any, @Param('id') realmId: number) {
    return this.mapService.getRealmDetail(realmId, req.user.userId);
  }

  @Post('enter-realm')
  async enterRealm(@Request() req: any, @Body('realmId') realmId: number) {
    return this.mapService.enterRealm(req.user.userId, realmId);
  }

  @Get('resources')
  async getNearbyResources(@Request() req: any, @Query('lat') lat: number, @Query('lng') lng: number) {
    return this.mapService.getNearbyResources(lat, lng);
  }

  // ========== 地盘占领系统 ==========

  @Get('territories')
  async getNearbyTerritories(@Request() req: any, @Query('lat') lat: number, @Query('lng') lng: number, @Query('radius') radius: number) {
    return this.mapService.getNearbyTerritories(req.user.userId, lat, lng, radius || 3000);
  }

  @Get('territories/my')
  async getMyTerritories(@Request() req: any) {
    return this.mapService.getMyTerritories(req.user.userId);
  }

  @Post('territories/:id/capture')
  async captureTerritory(@Request() req: any, @Param('id') territoryId: number, @Body('forceAttack') forceAttack: boolean) {
    return this.mapService.captureTerritory(req.user.userId, Number(territoryId), forceAttack);
  }

  @Post('territories/:id/attack')
  async attackTerritory(@Request() req: any, @Param('id') territoryId: number) {
    // 直接调用capture with forceAttack=true
    return this.mapService.captureTerritory(req.user.userId, Number(territoryId), true);
  }

  @Post('territories/:id/ally')
  async requestAlly(@Request() req: any, @Param('id') territoryId: number, @Body('message') message: string) {
    return this.mapService.requestAlly(req.user.userId, territoryId, message);
  }

  @Post('territories/:id/collect')
  async collectTerritoryResources(@Request() req: any, @Param('id') territoryId: number) {
    return this.mapService.collectTerritoryResources(req.user.userId, territoryId);
  }

  // ========== 流浪者系统 ==========

  @Get('wanderers')
  async getNearbyWanderers(@Request() req: any, @Query('lat') lat: number, @Query('lng') lng: number) {
    return this.mapService.getNearbyWanderers(req.user.userId, lat, lng);
  }

  @Post('territories/:id/shelter')
  async shelterWanderer(@Request() req: any, @Param('id') territoryId: number, @Body('wandererId') wandererId: number) {
    return this.mapService.shelterWanderer(req.user.userId, territoryId, wandererId);
  }

  @Post('wanderers/leave')
  async leaveShelter(@Request() req: any) {
    return this.mapService.leaveShelter(req.user.userId);
  }

  @Post('collect')
  async collectResource(@Request() req: any, @Body('resourceId') resourceId: number) {
    return this.mapService.collectResource(req.user.userId, resourceId);
  }
}