import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('user_wuxing')
export class UserWuxing {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column({ type: 'tinyint' })
  mainElement: number; // 主五行 1金2木3水4火5土

  @Column({ type: 'tinyint', nullable: true })
  subElement: number; // 副五行

  @Column({ length: 20, nullable: true })
  birthDate: string; // 农历生日

  @Column({ length: 20, nullable: true })
  birthTime: string; // 出生时辰

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 1 })
  metalRatio: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 1 })
  woodRatio: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 1 })
  waterRatio: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 1 })
  fireRatio: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 1 })
  earthRatio: number;

  @ManyToOne(() => User)
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}