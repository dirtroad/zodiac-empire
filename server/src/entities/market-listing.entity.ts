import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('market_listings')
export class MarketListing {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  sellerId: number;

  @Column({ type: 'tinyint' })
  itemType: number; // 1装备 2资源 3道具

  @Column()
  itemId: number;

  @Column({ length: 100 })
  itemName: string;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'bigint' })
  price: number; // 单价

  @Column({ type: 'tinyint', default: 1 })
  currency: number; // 1金币 2钻石 3时空晶体

  @Column({ type: 'tinyint', default: 1 })
  status: number; // 1在售 2已售 3下架

  @Column({ nullable: true })
  buyerId: number;

  @Column({ type: 'datetime', nullable: true })
  soldAt: Date;

  @Column({ type: 'int', default: 0 })
  viewCount: number;

  @ManyToOne(() => User)
  seller: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}