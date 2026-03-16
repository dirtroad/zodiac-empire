import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CrystalMineController } from './crystal-mine.controller';
import { CrystalMineService } from './crystal-mine.service';
import { User } from '../../entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [CrystalMineController],
  providers: [CrystalMineService],
  exports: [CrystalMineService],
})
export class CrystalMineModule {}
