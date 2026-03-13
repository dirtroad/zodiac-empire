import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from './user.entity';
import { EmotionCard } from './emotion-card.entity';

@Entity('emotion_votes')
export class EmotionVote {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  cardId: number;

  @Column({ type: 'tinyint' })
  voteType: number; // 1点赞 2踩

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => EmotionCard)
  card: EmotionCard;

  @CreateDateColumn()
  createdAt: Date;
}