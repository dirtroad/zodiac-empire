import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('user_equipments')
export class UserEquipment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  equipmentId: number;

  @Column({ length: 100 })
  name: string;

  @Column({ default: 1 })
  type: number;

  @Column({ default: 1 })
  rarity: number;

  @Column({ default: 1 })
  level: number;

  @Column({ type: 'int', default: 0 })
  currentPower: number;

  @Column({ default: false })
  isEquipped: boolean;

  @Column({ type: 'int', nullable: true })
  equippedSlot: number | null;

  @ManyToOne(() => User, (equipment) => equipment.equipments)
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}