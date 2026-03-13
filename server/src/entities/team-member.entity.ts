import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Team } from './team.entity';
import { User } from './user.entity';

@Entity('team_members')
export class TeamMember {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  teamId: number;

  @Column()
  userId: number;

  @Column({ type: 'tinyint', default: 2 })
  role: number; // 1队长 2成员

  @Column({ type: 'tinyint', nullable: true })
  position: number; // 战斗位置 1-5

  @Column({ type: 'bigint', default: 0 })
  contribution: number; // 贡献值

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  matchBonus: number; // 匹配加成

  @Column({ default: 0 })
  battles: number; // 参战次数

  @Column({ default: 0 })
  wins: number; // 胜利次数

  @ManyToOne(() => Team)
  team: Team;

  @ManyToOne(() => User)
  user: User;

  @CreateDateColumn()
  joinedAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}