import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ZodiacMatchController } from './zodiac-match.controller';
import { ZodiacMatchService } from './zodiac-match.service';
import { User } from '../../entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [ZodiacMatchController],
  providers: [ZodiacMatchService],
  exports: [ZodiacMatchService],
})
export class ZodiacMatchModule {}
