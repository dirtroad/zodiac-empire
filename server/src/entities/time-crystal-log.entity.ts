import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('time_crystal_logs')
export class TimeCrystalLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column({ type: 'bigint' })
  amount: number; // 变动数量（正为获得，负为消耗）

  @Column({ type: 'bigint' })
  balanceAfter: number; // 变动后余额

  @Column({ type: 'tinyint' })
  type: number; // 1任务 2战斗 3穿梭 4加速 5匹配

  @Column({ length: 200, nullable: true })
  description: string;

  @ManyToOne(() => User)
  user: User;

  @CreateDateColumn()
  createdAt: Date;
}