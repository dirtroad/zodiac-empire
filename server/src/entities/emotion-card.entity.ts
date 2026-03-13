import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('emotion_cards')
export class EmotionCard {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column({ length: 200, nullable: true })
  title: string;

  @Column({ type: 'tinyint' })
  contentType: number; // 1图片 2视频

  @Column({ length: 512 })
  contentUrl: string;

  @Column({ length: 512, nullable: true })
  thumbnailUrl: string;

  @Column({ type: 'tinyint', nullable: true })
  emotionType: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  emotionConfidence: number;

  @Column({ default: 0 })
  popularity: number;

  @Column({ type: 'tinyint', default: 1 })
  popularityLevel: number; // 1普通 2热门 3爆款 4现象级

  @Column({ default: false })
  isAnonymous: boolean;

  @Column({ default: false })
  isBlurred: boolean;

  @Column({ type: 'tinyint', default: 1 })
  status: number; // 1待审核 2正常 3违规 4下架

  @Column({ type: 'text', nullable: true })
  auditResult: string;

  @Column({ default: 0 })
  viewCount: number;

  @Column({ default: 0 })
  shareCount: number;

  @Column({ type: 'datetime', nullable: true })
  collectedAt: Date;

  @ManyToOne(() => User)
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}