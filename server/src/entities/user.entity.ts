import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Galaxy } from './galaxy.entity';
import { UserEquipment } from './user-equipment.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 64, unique: true })
  openid: string;

  @Column({ length: 64, nullable: true })
  unionid: string;

  @Column({ length: 64, nullable: true })
  nickname: string;

  @Column({ length: 512, nullable: true })
  avatarUrl: string;

  @Column({ default: 0 })
  gender: number;

  @Column({ default: 1 })
  level: number;

  @Column({ type: 'bigint', default: 0 })
  exp: number;

  @Column({ type: 'bigint', default: 100 })
  power: number;
  
  // 战斗属性
  @Column({ type: 'int', default: 0 })
  attack: number;  // 攻击
  
  @Column({ type: 'int', default: 0 })
  defense: number;  // 防御
  
  @Column({ type: 'int', default: 0 })
  tactics: number;  // 战术
  
  @Column({ type: 'int', default: 0 })
  critRate: number;  // 暴击率
  
  @Column({ type: 'int', default: 0 })
  dodgeRate: number;  // 闪避率
  
  // 资源加成
  @Column({ type: 'int', default: 0 })
  goldBonus: number;  // 金币加成
  
  @Column({ type: 'int', default: 0 })
  crystalBonus: number;  // 晶体加成

  @Column({ type: 'bigint', default: 1000 })
  gold: number;

  @Column({ default: 0 })
  diamond: number;

  @Column({ type: 'bigint', default: 0 })
  timeCoin: number;

  @Column({ type: 'bigint', default: 0 })
  bankedTimeCoin: number;

  @Column({ type: 'bigint', default: 0 })
  spaceTimeCrystal: number;

  @Column({ type: 'int', default: 0 })
  gachaPullCount: number;  // 抽卡次数（用于首抽保底）

  @Column({ type: 'int', default: 600 })
  creditScore: number;

  @Column({ type: 'tinyint', nullable: true })
  zodiacSign: number;

  @Column({ length: 20, nullable: true })
  zodiacName: string;

  // 星座觉醒
  @Column({ type: 'boolean', default: false })
  isZodiacAwakened: boolean;

  @Column({ length: 20, nullable: true })
  zodiacTrueName: string;

  @Column({ type: 'datetime', nullable: true })
  awakenedAt: Date;

  // 结婚系统
  @Column({ type: 'int', nullable: true, default: null })
  spouseId: number;

  @Column({ length: 64, nullable: true, default: null })
  spouseName: string;

  @Column({ type: 'datetime', nullable: true, default: null })
  weddingDate: Date;

  @Column({ type: 'boolean', default: false })
  hasWeddingBuff: boolean;

  // 每日签到
  @Column({ type: 'datetime', nullable: true })
  lastSigninAt: Date;

  @Column({ type: 'int', default: 0 })
  consecutiveSigninDays: number;

  // 水晶矿
  @Column({ type: 'datetime', nullable: true })
  lastCrystalMineAt: Date;

  @Column({ type: 'int', default: 0 })
  crystalMineProductivity: number;

  // 战斗连胜
  @Column({ type: 'int', default: 0 })
  winStreak: number;

  @Column({ type: 'int', default: 0 })
  maxWinStreak: number;

  @Column({ type: 'tinyint', default: 0 })
  vipLevel: number;

  @Column({ type: 'datetime', nullable: true })
  vipExpireAt: Date;

  @Column({ type: 'datetime', nullable: true })
  shieldUntil: Date;

  @Column({ type: 'datetime', nullable: true })
  lastLoginAt: Date;

  @Column({ type: 'datetime', nullable: true })
  lastActiveAt: Date;

  @Column({ type: 'int', default: 0 })
  onlineMinutes: number;

  @Column({ default: 1 })
  status: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Galaxy, (galaxy) => galaxy.user)
  galaxies: Galaxy[];

  @OneToMany(() => UserEquipment, (equipment) => equipment.user)
  equipments: UserEquipment[];
}