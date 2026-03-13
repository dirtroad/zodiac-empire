import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WuxingController } from './wuxing.controller';
import { WuxingService } from './wuxing.service';
import { UserWuxing } from '../../entities/user-wuxing.entity';
import { User } from '../../entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserWuxing, User])],
  controllers: [WuxingController],
  providers: [WuxingService],
  exports: [WuxingService],
})
export class WuxingModule {}