import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('trades')
export class Trade {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  sellerId: number;

  @Column()
  buyerId: number;

  @Column({ type: 'tinyint' })
  itemType: number;

  @Column()
  itemId: number;

  @Column({ length: 100 })
  itemName: string;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'bigint' })
  totalPrice: number;

  @Column({ type: 'tinyint' })
  currency: number;

  @Column()
  listingId: number;

  @ManyToOne(() => User)
  seller: User;

  @ManyToOne(() => User)
  buyer: User;

  @CreateDateColumn()
  createdAt: Date;
}