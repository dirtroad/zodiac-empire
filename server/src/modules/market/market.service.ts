import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MarketListing } from '../../entities/market-listing.entity';
import { Trade } from '../../entities/trade.entity';
import { User } from '../../entities/user.entity';
import { UserEquipment } from '../../entities/user-equipment.entity';
import { CreateListingDto } from './dto/create-listing.dto';

@Injectable()
export class MarketService {
  constructor(
    @InjectRepository(MarketListing)
    private listingRepository: Repository<MarketListing>,
    @InjectRepository(Trade)
    private tradeRepository: Repository<Trade>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(UserEquipment)
    private equipmentRepository: Repository<UserEquipment>,
  ) {}

  // 获取市场列表
  async getListings(params: {
    itemType?: number;
    minPrice?: number;
    maxPrice?: number;
    currency?: number;
    page: number;
    limit: number;
  }) {
    const query = this.listingRepository
      .createQueryBuilder('listing')
      .where('listing.status = :status', { status: 1 });

    if (params.itemType) {
      query.andWhere('listing.itemType = :itemType', { itemType: params.itemType });
    }
    if (params.currency) {
      query.andWhere('listing.currency = :currency', { currency: params.currency });
    }
    if (params.minPrice) {
      query.andWhere('listing.price >= :minPrice', { minPrice: params.minPrice });
    }
    if (params.maxPrice) {
      query.andWhere('listing.price <= :maxPrice', { maxPrice: params.maxPrice });
    }

    query
      .orderBy('listing.createdAt', 'DESC')
      .skip((params.page - 1) * params.limit)
      .take(params.limit);

    const [listings, total] = await query.getManyAndCount();

    // 获取卖家信息
    const sellerIds = [...new Set(listings.map(l => l.sellerId))];
    const sellers = await this.userRepository.findByIds(sellerIds);

    return {
      listings: listings.map(l => ({
        id: l.id,
        itemType: l.itemType,
        itemId: l.itemId,
        itemName: l.itemName,
        quantity: l.quantity,
        price: l.price,
        currency: l.currency,
        seller: sellers.find(s => s.id === l.sellerId)?.nickname || '匿名',
        viewCount: l.viewCount,
        createdAt: l.createdAt,
      })),
      total,
      page: params.page,
      limit: params.limit,
    };
  }

  // 获取我的挂单
  async getMyListings(userId: number) {
    return this.listingRepository.find({
      where: { sellerId: userId },
      order: { createdAt: 'DESC' },
    });
  }

  // 获取我的交易记录
  async getMyTrades(userId: number) {
    const [asBuyer, asSeller] = await Promise.all([
      this.tradeRepository.find({
        where: { buyerId: userId },
        order: { createdAt: 'DESC' },
        take: 50,
      }),
      this.tradeRepository.find({
        where: { sellerId: userId },
        order: { createdAt: 'DESC' },
        take: 50,
      }),
    ]);

    return { asBuyer, asSeller };
  }

  // 创建挂单
  async createListing(userId: number, dto: CreateListingDto) {
    // 检查用户是否已有太多挂单
    const existingCount = await this.listingRepository.count({
      where: { sellerId: userId, status: 1 },
    });
    if (existingCount >= 10) {
      throw new BadRequestException('最多同时挂10个商品');
    }

    // 如果是装备，检查是否拥有
    if (dto.itemType === 1) {
      const equipment = await this.equipmentRepository.findOne({
        where: { id: dto.itemId, userId },
      });
      if (!equipment) {
        throw new NotFoundException('装备不存在');
      }
      if (equipment.isEquipped) {
        throw new BadRequestException('装备已穿戴，请先卸下');
      }

      // 创建挂单
      const listing = this.listingRepository.create({
        sellerId: userId,
        itemType: dto.itemType,
        itemId: dto.itemId,
        itemName: equipment.name,
        quantity: 1,
        price: dto.price,
        currency: dto.currency || 1,
      });
      await this.listingRepository.save(listing);

      // 移除装备
      await this.equipmentRepository.remove(equipment);

      return listing;
    }

    // 其他类型商品（资源、道具）
    const listing = this.listingRepository.create({
      sellerId: userId,
      itemType: dto.itemType,
      itemId: dto.itemId,
      itemName: dto.itemName || `商品${dto.itemId}`,
      quantity: dto.quantity || 1,
      price: dto.price,
      currency: dto.currency || 1,
    });

    return this.listingRepository.save(listing);
  }

  // 购买商品
  async buyItem(userId: number, listingId: number) {
    const listing = await this.listingRepository.findOne({
      where: { id: listingId },
    });
    if (!listing) {
      throw new NotFoundException('商品不存在');
    }
    if (listing.status !== 1) {
      throw new BadRequestException('商品已下架或已售出');
    }
    if (listing.sellerId === userId) {
      throw new BadRequestException('不能购买自己的商品');
    }

    const buyer = await this.userRepository.findOne({ where: { id: userId } });
    const seller = await this.userRepository.findOne({ where: { id: listing.sellerId } });

    if (!buyer || !seller) {
      throw new NotFoundException('用户不存在');
    }

    const totalPrice = Number(listing.price) * listing.quantity;

    // 检查买家货币是否足够
    if (listing.currency === 1) {
      if (buyer.gold < totalPrice) {
        throw new BadRequestException('金币不足');
      }
      buyer.gold -= totalPrice;
      seller.gold += totalPrice;
    } else if (listing.currency === 2) {
      if (buyer.diamond < totalPrice) {
        throw new BadRequestException('钻石不足');
      }
      buyer.diamond -= totalPrice;
      seller.diamond += totalPrice;
    }

    // 更新挂单状态
    listing.status = 2;
    listing.buyerId = userId;
    listing.soldAt = new Date();

    // 创建交易记录
    const trade = this.tradeRepository.create({
      sellerId: listing.sellerId,
      buyerId: userId,
      itemType: listing.itemType,
      itemId: listing.itemId,
      itemName: listing.itemName,
      quantity: listing.quantity,
      totalPrice,
      currency: listing.currency,
      listingId: listing.id,
    });

    await Promise.all([
      this.listingRepository.save(listing),
      this.tradeRepository.save(trade),
      this.userRepository.save(buyer),
      this.userRepository.save(seller),
    ]);

    // 如果是装备，转移给买家
    if (listing.itemType === 1) {
      const equipment = this.equipmentRepository.create({
        userId,
        equipmentId: listing.itemId,
        name: listing.itemName,
        type: 1,
        rarity: 1,
        level: 1,
        currentPower: 100,
        isEquipped: false,
      });
      await this.equipmentRepository.save(equipment);
    }

    return {
      success: true,
      message: '购买成功',
      item: listing.itemName,
      totalPrice,
      currency: listing.currency === 1 ? '金币' : '钻石',
    };
  }

  // 下架商品
  async cancelListing(userId: number, listingId: number) {
    const listing = await this.listingRepository.findOne({
      where: { id: listingId },
    });
    if (!listing) {
      throw new NotFoundException('商品不存在');
    }
    if (listing.sellerId !== userId) {
      throw new ForbiddenException('只能下架自己的商品');
    }
    if (listing.status !== 1) {
      throw new BadRequestException('商品已下架或已售出');
    }

    listing.status = 3;
    await this.listingRepository.save(listing);

    // 如果是装备，返还给卖家
    if (listing.itemType === 1) {
      const equipment = this.equipmentRepository.create({
        userId,
        equipmentId: listing.itemId,
        name: listing.itemName,
        type: 1,
        rarity: 1,
        level: 1,
        currentPower: 100,
        isEquipped: false,
      });
      await this.equipmentRepository.save(equipment);
    }

    return { success: true, message: '已下架' };
  }

  // 获取市场统计
  async getStats() {
    const [totalListings, totalTrades, totalVolume] = await Promise.all([
      this.listingRepository.count({ where: { status: 1 } }),
      this.tradeRepository.count(),
      this.tradeRepository
        .createQueryBuilder('trade')
        .select('SUM(trade.totalPrice)', 'total')
        .getRawOne(),
    ]);

    return {
      totalListings,
      totalTrades,
      totalVolume: totalVolume?.total || 0,
    };
  }

  // 获取热门商品
  async getHotItems(limit: number) {
    return this.listingRepository.find({
      where: { status: 1 },
      order: { viewCount: 'DESC' },
      take: limit,
    });
  }
}