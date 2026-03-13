import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('equipment_templates')
export class EquipmentTemplate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 500, nullable: true })
  description: string;

  @Column({ default: 1 })
  type: number; // 1武器 2防具 3饰品

  @Column({ default: 1 })
  rarity: number; // 1普通 2稀有 3史诗 4传说

  @Column({ default: 1 })
  level: number;

  @Column({ type: 'int', default: 0 })
  basePower: number;

  @Column({ type: 'int', default: 0 })
  baseAttack: number;

  @Column({ type: 'int', default: 0 })
  baseDefense: number;

  @Column({ type: 'int', nullable: true })
  wuxing: number; // 五行属性 1金2木3水4火5土

  @Column({ type: 'int', nullable: true })
  zodiac: number; // 星座加成

  @Column({ type: 'json', nullable: true })
  skills: any; // 附带技能

  @Column({ type: 'json', nullable: true })
  attributes: any; // 额外属性

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}