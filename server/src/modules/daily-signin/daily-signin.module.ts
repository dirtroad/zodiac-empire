import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DailySigninController } from './daily-signin.controller';
import { DailySigninService } from './daily-signin.service';
import { User } from '../../entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [DailySigninController],
  providers: [DailySigninService],
  exports: [DailySigninService],
})
export class DailySigninModule {}
