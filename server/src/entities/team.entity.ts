import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('teams')
export class Team {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column()
  leaderId: number;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ length: 512, nullable: true })
  badgeUrl: string;

  @Column({ default: 1 })
  level: number;

  @Column({ default: 1 })
  memberCount: number;

  @Column({ default: 5 })
  maxMembers: number;

  @Column({ type: 'bigint', default: 0 })
  totalPower: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  matchBonus: number;

  @Column({ default: 0 })
  score: number;

  @Column({ default: 0 })
  teamRank: number;

  @Column({ default: 0 })
  wins: number;

  @Column({ default: 0 })
  losses: number;

  @Column({ default: 0 })
  weeklyBattles: number;

  @Column({ type: 'tinyint', default: 1 })
  status: number;

  @ManyToOne(() => User)
  leader: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}