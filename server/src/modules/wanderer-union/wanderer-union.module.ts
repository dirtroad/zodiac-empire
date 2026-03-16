import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WandererUnionController } from './wanderer-union.controller';
import { WandererUnionService } from './wanderer-union.service';
import { User } from '../../entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [WandererUnionController],
  providers: [WandererUnionService],
  exports: [WandererUnionService],
})
export class WandererUnionModule {}
