import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AwakeningController } from './awakening.controller';
import { AwakeningService } from './awakening.service';
import { User } from '../../entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [AwakeningController],
  providers: [AwakeningService],
  exports: [AwakeningService],
})
export class AwakeningModule {}
