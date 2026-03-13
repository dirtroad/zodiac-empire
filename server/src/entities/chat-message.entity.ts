import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, Index } from 'typeorm';

@Entity('chat_messages')
export class ChatMessage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Index()
  roomId: string; // 房间ID: 'global' | 'zodiac_1' | 'private_userId1_userId2'

  @Column()
  userId: number;

  @Column({ length: 100 })
  nickname: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'int', nullable: true })
  zodiacSign: number;

  @Column({ default: 0 })
  type: number; // 0普通 1系统 2表情

  @CreateDateColumn()
  @Index()
  createdAt: Date;
}