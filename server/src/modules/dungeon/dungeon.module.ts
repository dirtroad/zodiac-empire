import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../entities/user.entity';
import { DungeonService } from './dungeon.service';
import { DungeonController } from './dungeon.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [DungeonService],
  controllers: [DungeonController],
  exports: [DungeonService],
})
export class DungeonModule {}
