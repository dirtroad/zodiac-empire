import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('emotions')
export class Emotion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column({ type: 'tinyint' })
  emotionType: number; // 1快乐 2平静 3激情 4智慧 5愤怒 6焦虑

  @Column({ length: 20, nullable: true })
  emotionName: string;

  @Column({ type: 'bigint', default: 0 })
  amount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  dailyProduction: number;

  @Column({ type: 'datetime', nullable: true })
  lastCollectAt: Date;

  @ManyToOne(() => User)
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}