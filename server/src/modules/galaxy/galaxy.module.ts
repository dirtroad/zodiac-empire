import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GalaxyController } from './galaxy.controller';
import { GalaxyService } from './galaxy.service';
import { Galaxy } from '../../entities/galaxy.entity';
import { User } from '../../entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Galaxy, User])],
  controllers: [GalaxyController],
  providers: [GalaxyService],
  exports: [GalaxyService],
})
export class GalaxyModule {}