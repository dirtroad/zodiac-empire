import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MarketController } from './market.controller';
import { MarketService } from './market.service';
import { MarketListing } from '../../entities/market-listing.entity';
import { Trade } from '../../entities/trade.entity';
import { User } from '../../entities/user.entity';
import { UserEquipment } from '../../entities/user-equipment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MarketListing, Trade, User, UserEquipment])],
  controllers: [MarketController],
  providers: [MarketService],
  exports: [MarketService],
})
export class MarketModule {}