import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BattleController } from './battle.controller';
import { BattleService } from './battle.service';
import { User } from '../../entities/user.entity';
import { Galaxy } from '../../entities/galaxy.entity';
import { BattleRecord } from '../../entities/battle-record.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Galaxy, BattleRecord])],
  controllers: [BattleController],
  providers: [BattleService],
  exports: [BattleService],
})
export class BattleModule {}