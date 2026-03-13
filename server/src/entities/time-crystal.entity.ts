import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('time_crystals')
export class TimeCrystal {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column({ type: 'bigint', default: 0 })
  balance: number; // 当前余额

  @Column({ type: 'bigint', default: 0 })
  totalEarned: number; // 累计获得

  @Column({ type: 'bigint', default: 0 })
  totalSpent: number; // 累计消耗

  @ManyToOne(() => User)
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}