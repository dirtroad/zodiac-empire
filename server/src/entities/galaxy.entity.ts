import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('galaxies')
export class Galaxy {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column({ length: 100 })
  name: string;

  @Column({ default: 1 })
  type: number;

  @Column({ default: 1 })
  rarity: number;

  @Column({ default: 1 })
  size: number;

  @Column({ default: 1 })
  level: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 100 })
  baseProduction: number;

  @Column({ type: 'bigint', default: 0 })
  defensePower: number;

  @Column({ default: false })
  isMain: boolean;

  @ManyToOne(() => User, (user) => user.galaxies)
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}