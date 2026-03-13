import { Controller, Get, Post, Delete, Body, Param, Request, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { MarketService } from './market.service';
import { CreateListingDto } from './dto/create-listing.dto';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('市场')
@Controller('market')
export class MarketController {
  constructor(private readonly marketService: MarketService) {}

  @Public()
  @Get('listings')
  @ApiOperation({ summary: '获取市场商品列表' })
  async getListings(
    @Query('itemType') itemType?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('currency') currency?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.marketService.getListings({
      itemType: itemType ? parseInt(itemType, 10) : undefined,
      minPrice: minPrice ? parseInt(minPrice, 10) : undefined,
      maxPrice: maxPrice ? parseInt(maxPrice, 10) : undefined,
      currency: currency ? parseInt(currency, 10) : undefined,
      page: parseInt(page || '1', 10) || 1,
      limit: parseInt(limit || '20', 10) || 20,
    });
  }

  @Get('my-listings')
  @ApiBearerAuth()
  @ApiOperation({ summary: '获取我的挂单' })
  async getMyListings(@Request() req: any) {
    return this.marketService.getMyListings(req.user.userId);
  }

  @Get('my-trades')
  @ApiBearerAuth()
  @ApiOperation({ summary: '获取我的交易记录' })
  async getMyTrades(@Request() req: any) {
    return this.marketService.getMyTrades(req.user.userId);
  }

  @Post('listings')
  @ApiBearerAuth()
  @ApiOperation({ summary: '创建挂单' })
  async createListing(@Request() req: any, @Body() dto: CreateListingDto) {
    return this.marketService.createListing(req.user.userId, dto);
  }

  @Post('listings/:id/buy')
  @ApiBearerAuth()
  @ApiOperation({ summary: '购买商品' })
  async buyItem(@Request() req: any, @Param('id') listingId: string) {
    return this.marketService.buyItem(req.user.userId, parseInt(listingId, 10) || 0);
  }

  @Delete('listings/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: '下架商品' })
  async cancelListing(@Request() req: any, @Param('id') listingId: string) {
    return this.marketService.cancelListing(req.user.userId, parseInt(listingId, 10) || 0);
  }

  @Public()
  @Get('stats')
  @ApiOperation({ summary: '获取市场统计' })
  async getStats() {
    return this.marketService.getStats();
  }

  @Public()
  @Get('hot')
  @ApiOperation({ summary: '获取热门商品' })
  async getHotItems(@Query('limit') limit?: string) {
    return this.marketService.getHotItems(parseInt(limit || '10', 10) || 10);
  }
}