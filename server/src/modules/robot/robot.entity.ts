import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../entities/user.entity';

@Entity('robots')
export class Robot {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  owner: User;

  @Column({ length: 64 })
  name: string;

  @Column({ length: 20 })
  type: 'battle' | 'collection' | 'trade'; // 战斗型/采集型/贸易型

  @Column({ default: 1 })
  level: number;

  @Column({ type: 'int', default: 100 })
  power: number;

  @Column({ type: 'int', default: 0 })
  attack: number;

  @Column({ type: 'int', default: 0 })
  defense: number;

  @Column({ type: 'int', default: 0 })
  collectionEfficiency: number; // 采集效率

  @Column({ type: 'int', default: 0 })
  tradeSkill: number; // 贸易技能

  @Column({ default: false })
  isAutoBattle: boolean; // 自动战斗

  @Column({ default: false })
  isAutoCollect: boolean; // 自动采集

  @Column({ default: false })
  isAutoTrade: boolean; // 自动贸易

  @Column({ type: 'datetime', nullable: true })
  lastActiveAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
