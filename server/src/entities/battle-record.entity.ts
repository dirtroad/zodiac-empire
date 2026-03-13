import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('battle_records')
export class BattleRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  attackerId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'attackerId' })
  attacker: User;

  @Column()
  defenderId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'defenderId' })
  defender: User;

  @Column()
  result: string; // win, lose

  @Column({ type: 'int', default: 0 })
  attackPower: number;

  @Column({ type: 'int', default: 0 })
  defensePower: number;

  @Column({ type: 'int', default: 0 })
  goldReward: number;

  @Column({ type: 'int', default: 0 })
  powerChange: number;

  @CreateDateColumn()
  createdAt: Date;
}