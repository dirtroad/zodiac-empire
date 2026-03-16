import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmotionLiveController } from './emotion-live.controller';
import { EmotionLiveService } from './emotion-live.service';
import { User } from '../../entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [EmotionLiveController],
  providers: [EmotionLiveService],
  exports: [EmotionLiveService],
})
export class EmotionLiveModule {}
