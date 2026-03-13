import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MapController } from './map.controller';
import { MapService } from './map.service';
import { User } from '../../entities/user.entity';
import { TimeCrystal } from '../../entities/time-crystal.entity';
import { Territory } from '../../entities/territory.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, TimeCrystal, Territory])],
  controllers: [MapController],
  providers: [MapService],
  exports: [MapService],
})
export class MapModule {}