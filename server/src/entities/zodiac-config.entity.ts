import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('zodiac_configs')
export class ZodiacConfig {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'tinyint', unique: true })
  zodiacSign: number; // 1-12

  @Column({ length: 20 })
  name: string; // 白羊座、金牛座...

  @Column({ length: 20 })
  element: string; // 火、土、风、水

  @Column({ type: 'tinyint' })
  polarity: number; // 1阳性 2阴性

  @Column({ type: 'tinyint' })
  opposite: number; // 对宫星座编号

  @Column({ length: 50, nullable: true })
  starRealm: string; // 星域名称

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  powerBonus: number; // 战力加成

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  productionBonus: number; // 产量加成

  @Column({ type: 'json', nullable: true })
  compatible: any; // 相容星座

  @Column({ type: 'json', nullable: true })
  skills: any; // 专属技能

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}