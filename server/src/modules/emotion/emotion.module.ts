import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmotionController } from './emotion.controller';
import { EmotionService } from './emotion.service';
import { Emotion } from '../../entities/emotion.entity';
import { EmotionCard } from '../../entities/emotion-card.entity';
import { EmotionVote } from '../../entities/emotion-vote.entity';
import { User } from '../../entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Emotion, EmotionCard, EmotionVote, User])],
  controllers: [EmotionController],
  providers: [EmotionService],
  exports: [EmotionService],
})
export class EmotionModule {}