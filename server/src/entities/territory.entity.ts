import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('territories')
export class Territory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 64 })
  name: string;

  @Column({ length: 32 })
  type: string;

  @Column({ length: 32 })
  typeName: string;

  @Column({ length: 32 })
  outputType: string; // gold, crystal

  @Column({ type: 'int' })
  outputAmount: number;

  @Column({ length: 20, nullable: true })
  terrainType: string;  // 战斗地形：plain/fire/ice/forest/void/mountain

  @Column({ type: 'decimal', precision: 10, scale: 6 })
  lat: number;

  @Column({ type: 'decimal', precision: 10, scale: 6 })
  lng: number;

  @Column({ type: 'int', nullable: true })
  ownerId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'ownerId' })
  owner: User;

  @Column({ type: 'datetime', nullable: true })
  lastCollectAt: Date;

  @Column({ type: 'int', default: 0 })
  accumulatedGold: number;

  @Column({ type: 'int', default: 0 })
  accumulatedCrystal: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}