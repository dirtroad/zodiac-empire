import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TimebankController } from './timebank.controller';
import { TimebankService } from './timebank.service';
import { TimeCrystal } from '../../entities/time-crystal.entity';
import { TimeCrystalLog } from '../../entities/time-crystal-log.entity';
import { User } from '../../entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TimeCrystal, TimeCrystalLog, User])],
  controllers: [TimebankController],
  providers: [TimebankService],
  exports: [TimebankService],
})
export class TimebankModule {}