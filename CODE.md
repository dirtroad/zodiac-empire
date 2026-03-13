# 星座帝国 - 项目代码框架

> 前后端代码框架 v1.0

---

## 一、项目结构

```
zodiac-empire/
├── client/                    # 前端（Cocos Creator）
│   ├── assets/
│   │   ├── scripts/
│   │   │   ├── core/          # 核心模块
│   │   │   ├── ui/            # UI模块
│   │   │   ├── models/        # 数据模型
│   │   │   └── utils/         # 工具函数
│   │   ├── scenes/            # 场景文件
│   │   └── resources/         # 动态资源
│   └── package.json
│
├── server/                    # 后端（NestJS）
│   ├── src/
│   │   ├── modules/           # 业务模块
│   │   ├── common/            # 公共模块
│   │   ├── entities/          # 数据库实体
│   │   └── main.ts
│   └── package.json
│
└── docs/                      # 文档
```

---

## 二、前端核心代码

### 2.1 GameManager.ts - 游戏管理器

```typescript
// assets/scripts/core/GameManager.ts
import { _decorator, Component, Node } from 'cc';
import { NetworkManager } from './NetworkManager';
import { StorageManager } from './StorageManager';
import { AudioManager } from './AudioManager';

const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {
    
    private static _instance: GameManager = null;
    
    public static get instance(): GameManager {
        return this._instance;
    }
    
    // 游戏状态
    public isInitialized: boolean = false;
    public currentUser: UserModel = null;
    public gameConfig: GameConfig = null;
    
    onLoad() {
        if (GameManager._instance) {
            this.node.destroy();
            return;
        }
        GameManager._instance = this;
        cc.game.addPersistRootNode(this.node);
        
        this.initGame();
    }
    
    async initGame() {
        console.log('[GameManager] 初始化游戏...');
        
        // 初始化各管理器
        await StorageManager.instance.init();
        await NetworkManager.instance.init();
        AudioManager.instance.init();
        
        // 检查登录状态
        const token = StorageManager.instance.getToken();
        if (token) {
            await this.autoLogin();
        } else {
            this.showLoginScene();
        }
        
        this.isInitialized = true;
        console.log('[GameManager] 游戏初始化完成');
    }
    
    async autoLogin() {
        try {
            const user = await NetworkManager.instance.getUserInfo();
            this.currentUser = user;
            this.enterMainScene();
        } catch (error) {
            console.error('[GameManager] 自动登录失败', error);
            this.showLoginScene();
        }
    }
    
    showLoginScene() {
        cc.director.loadScene('Login');
    }
    
    enterMainScene() {
        cc.director.loadScene('Main');
    }
    
    // 更新用户数据
    updateUser(data: Partial<UserModel>) {
        this.currentUser = { ...this.currentUser, ...data };
        StorageManager.instance.saveUserData(this.currentUser);
    }
}

// 数据模型
interface UserModel {
    id: number;
    openid: string;
    nickname: string;
    avatarUrl: string;
    level: number;
    exp: number;
    power: number;
    gold: number;
    diamond: number;
    timeCoin: number;
    zodiac: ZodiacModel;
}

interface ZodiacModel {
    sign: number;
    name: string;
    element: string;
    regionName: string;
    bonus: Record<string, number>;
}

interface GameConfig {
    version: string;
    serverUrl: string;
    cdnUrl: string;
}
```

### 2.2 NetworkManager.ts - 网络管理器

```typescript
// assets/scripts/core/NetworkManager.ts
import { _decorator, Component } from 'cc';
import { StorageManager } from './StorageManager';

const { ccclass } = _decorator;

const API_BASE_URL = 'https://api.zodiac-empire.com/v1';

@ccclass('NetworkManager')
export class NetworkManager extends Component {
    
    private static _instance: NetworkManager = null;
    public static get instance(): NetworkManager {
        return this._instance;
    }
    
    private token: string = '';
    
    async init() {
        this.token = StorageManager.instance.getToken();
        console.log('[NetworkManager] 初始化完成');
    }
    
    setToken(token: string) {
        this.token = token;
        StorageManager.instance.setToken(token);
    }
    
    // 通用请求方法
    async request<T>(
        method: 'GET' | 'POST' | 'PUT' | 'DELETE',
        url: string,
        data?: any
    ): Promise<T> {
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
        };
        
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }
        
        const options: RequestInit = {
            method,
            headers,
        };
        
        if (data && method !== 'GET') {
            options.body = JSON.stringify(data);
        }
        
        try {
            const response = await fetch(`${API_BASE_URL}${url}`, options);
            const result = await response.json();
            
            if (result.code !== 0) {
                throw new Error(result.message);
            }
            
            return result.data as T;
        } catch (error) {
            console.error(`[NetworkManager] 请求失败: ${url}`, error);
            throw error;
        }
    }
    
    // 微信登录
    async wechatLogin(code: string): Promise<LoginResult> {
        const result = await this.request<LoginResult>('POST', '/auth/wechat/login', {
            code,
        });
        
        this.setToken(result.access_token);
        return result;
    }
    
    // 获取用户信息
    async getUserInfo(): Promise<UserModel> {
        return this.request<UserModel>('GET', '/users/me');
    }
    
    // 获取星系列表
    async getGalaxies(): Promise<GalaxyModel[]> {
        return this.request<GalaxyModel[]>('GET', '/users/me/galaxies');
    }
    
    // 获取装备列表
    async getEquipments(): Promise<EquipmentModel[]> {
        return this.request<EquipmentModel[]>('GET', '/users/me/equipments');
    }
    
    // 发起战斗
    async startBattle(defenderId: number, battleType: number): Promise<BattleResult> {
        return this.request<BattleResult>('POST', '/battles', {
            defender_id: defenderId,
            battle_type: battleType,
        });
    }
    
    // 获取市场列表
    async getMarketListings(params: MarketQueryParams): Promise<MarketListResult> {
        const query = new URLSearchParams(params as any).toString();
        return this.request<MarketListResult>('GET', `/market/listings?${query}`);
    }
}

// 响应模型
interface LoginResult {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    user: UserModel;
    is_new_user: boolean;
}

interface GalaxyModel {
    id: number;
    name: string;
    type: number;
    rarity: number;
    size: number;
    level: number;
    baseProduction: number;
    defensePower: number;
    isMain: boolean;
    buildings: BuildingModel[];
}

interface BuildingModel {
    id: number;
    type: number;
    level: number;
    productionRate: number;
}

interface EquipmentModel {
    id: number;
    equipmentId: number;
    name: string;
    type: number;
    rarity: number;
    level: number;
    currentPower: number;
    isEquipped: boolean;
}

interface BattleResult {
    battleId: number;
    attackerPower: number;
    defenderPower: number;
    winnerId: number;
    isWin: boolean;
    rewardOptions: RewardOption[];
}

interface RewardOption {
    type: string;
    id?: number;
    name: string;
}

interface MarketQueryParams {
    item_type?: number;
    page?: number;
    page_size?: number;
}

interface MarketListResult {
    listings: any[];
    pagination: {
        page: number;
        page_size: number;
        total: number;
    };
}
```

### 2.3 StorageManager.ts - 存储管理器

```typescript
// assets/scripts/core/StorageManager.ts
import { _decorator, Component } from 'cc';

const { ccclass } = _decorator;

const STORAGE_KEYS = {
    TOKEN: 'zodiac_token',
    USER_DATA: 'zodiac_user',
    SETTINGS: 'zodiac_settings',
};

@ccclass('StorageManager')
export class StorageManager extends Component {
    
    private static _instance: StorageManager = null;
    public static get instance(): StorageManager {
        return this._instance;
    }
    
    async init() {
        console.log('[StorageManager] 初始化完成');
    }
    
    // Token 管理
    getToken(): string {
        return sys.localStorage.getItem(STORAGE_KEYS.TOKEN) || '';
    }
    
    setToken(token: string) {
        sys.localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    }
    
    removeToken() {
        sys.localStorage.removeItem(STORAGE_KEYS.TOKEN);
    }
    
    // 用户数据
    getUserData(): any {
        const data = sys.localStorage.getItem(STORAGE_KEYS.USER_DATA);
        return data ? JSON.parse(data) : null;
    }
    
    saveUserData(data: any) {
        sys.localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(data));
    }
    
    clearUserData() {
        sys.localStorage.removeItem(STORAGE_KEYS.USER_DATA);
    }
    
    // 设置
    getSettings(): GameSettings {
        const data = sys.localStorage.getItem(STORAGE_KEYS.SETTINGS);
        return data ? JSON.parse(data) : this.getDefaultSettings();
    }
    
    saveSettings(settings: GameSettings) {
        sys.localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    }
    
    private getDefaultSettings(): GameSettings {
        return {
            musicVolume: 1.0,
            soundVolume: 1.0,
            vibration: true,
            notification: true,
        };
    }
}

interface GameSettings {
    musicVolume: number;
    soundVolume: number;
    vibration: boolean;
    notification: boolean;
}
```

---

## 三、后端核心代码

### 3.1 main.ts - 入口文件

```typescript
// server/src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    
    // 全局前缀
    app.setGlobalPrefix('v1');
    
    // CORS
    app.enableCors({
        origin: ['https://servicewechat.com'],
        credentials: true,
    });
    
    // 全局管道
    app.useGlobalPipes(new ValidationPipe({
        transform: true,
        whitelist: true,
    }));
    
    // 全局拦截器
    app.useGlobalInterceptors(new TransformInterceptor());
    
    // 全局过滤器
    app.useGlobalFilters(new HttpExceptionFilter());
    
    const port = process.env.PORT || 3000;
    await app.listen(port);
    
    console.log(`🚀 Server running on port ${port}`);
}
bootstrap();
```

### 3.2 app.module.ts - 根模块

```typescript
// server/src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';

import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { GalaxyModule } from './modules/galaxy/galaxy.module';
import { EquipmentModule } from './modules/equipment/equipment.module';
import { BattleModule } from './modules/battle/battle.module';
import { MarketModule } from './modules/market/market.module';
import { EmotionModule } from './modules/emotion/emotion.module';
import { TimeBankModule } from './modules/time-bank/time-bank.module';
import { AllianceModule } from './modules/alliance/alliance.module';

import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';

@Module({
    imports: [
        // 配置
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: ['.env.local', '.env'],
        }),
        
        // 数据库
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT, 10),
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE,
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            synchronize: process.env.NODE_ENV !== 'production',
            logging: process.env.NODE_ENV !== 'production',
        }),
        
        // 业务模块
        AuthModule,
        UserModule,
        GalaxyModule,
        EquipmentModule,
        BattleModule,
        MarketModule,
        EmotionModule,
        TimeBankModule,
        AllianceModule,
    ],
    providers: [
        {
            provide: APP_GUARD,
            useClass: JwtAuthGuard,
        },
    ],
})
export class AppModule {}
```

### 3.3 user.entity.ts - 用户实体

```typescript
// server/src/entities/user.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
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
    
    @Column({ type: 'bigint', default: 1000 })
    gold: number;
    
    @Column({ default: 0 })
    diamond: number;
    
    @Column({ type: 'bigint', default: 0 })
    timeCoin: number;
    
    @Column({ default: 0 })
    vipLevel: number;
    
    @Column({ type: 'datetime', nullable: true })
    vipExpireAt: Date;
    
    @Column({ type: 'datetime', nullable: true })
    shieldUntil: Date;
    
    @Column({ type: 'datetime', nullable: true })
    lastLoginAt: Date;
    
    @Column({ default: 1 })
    status: number;
    
    @CreateDateColumn()
    createdAt: Date;
    
    @UpdateDateColumn()
    updatedAt: Date;
    
    @OneToMany(() => Galaxy, galaxy => galaxy.user)
    galaxies: Galaxy[];
    
    @OneToMany(() => UserEquipment, equipment => equipment.user)
    equipments: UserEquipment[];
}
```

### 3.4 auth.service.ts - 认证服务

```typescript
// server/src/modules/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { WechatService } from './wechat.service';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private jwtService: JwtService,
        private wechatService: WechatService,
    ) {}
    
    async wechatLogin(code: string) {
        // 获取微信openid
        const { openid, unionid } = await this.wechatService.getOpenid(code);
        
        // 查找或创建用户
        let user = await this.userRepository.findOne({ where: { openid } });
        let isNewUser = false;
        
        if (!user) {
            user = this.userRepository.create({
                openid,
                unionid,
                nickname: `旅行者${Date.now().toString().slice(-6)}`,
            });
            await this.userRepository.save(user);
            isNewUser = true;
        }
        
        // 更新登录时间
        user.lastLoginAt = new Date();
        await this.userRepository.save(user);
        
        // 生成token
        const payload = { sub: user.id, openid: user.openid };
        const accessToken = this.jwtService.sign(payload, { expiresIn: '2h' });
        const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });
        
        return {
            access_token: accessToken,
            refresh_token: refreshToken,
            expires_in: 7200,
            user: this.toUserDto(user),
            is_new_user: isNewUser,
        };
    }
    
    async validateUser(userId: number): Promise<User> {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user || user.status !== 1) {
            throw new UnauthorizedException('用户不存在或已被禁用');
        }
        return user;
    }
    
    private toUserDto(user: User) {
        return {
            id: user.id,
            nickname: user.nickname,
            avatarUrl: user.avatarUrl,
            level: user.level,
            exp: user.exp,
            power: user.power,
            gold: user.gold,
            diamond: user.diamond,
            timeCoin: user.timeCoin,
        };
    }
}
```

### 3.5 battle.service.ts - 战斗服务

```typescript
// server/src/modules/battle/battle.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Battle } from '../../entities/battle.entity';
import { User } from '../../entities/user.entity';
import { Galaxy } from '../../entities/galaxy.entity';
import { UserEquipment } from '../../entities/user-equipment.entity';

@Injectable()
export class BattleService {
    constructor(
        @InjectRepository(Battle)
        private battleRepository: Repository<Battle>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private dataSource: DataSource,
    ) {}
    
    async startBattle(attackerId: number, defenderId: number, battleType: number) {
        // 检查是否可以攻击
        const defender = await this.userRepository.findOne({
            where: { id: defenderId },
            relations: ['galaxies', 'equipments'],
        });
        
        if (!defender) {
            throw new BadRequestException('对手不存在');
        }
        
        if (defender.shieldUntil && new Date() < defender.shieldUntil) {
            throw new BadRequestException('对手处于护盾保护中');
        }
        
        // 计算战力
        const attacker = await this.userRepository.findOne({
            where: { id: attackerId },
            relations: ['galaxies', 'equipments'],
        });
        
        const attackerPower = this.calculatePower(attacker);
        const defenderPower = this.calculatePower(defender);
        
        // 判定胜负
        const winRate = attackerPower / (attackerPower + defenderPower);
        const isWin = Math.random() < winRate;
        
        // 生成战斗记录
        const battle = this.battleRepository.create({
            attackerId,
            defenderId,
            battleType,
            attackerPower,
            defenderPower,
            winnerId: isWin ? attackerId : defenderId,
            battleData: {
                rounds: this.generateBattleRounds(attackerPower, defenderPower, isWin),
            },
        });
        
        await this.battleRepository.save(battle);
        
        // 更新护盾
        if (!isWin) {
            defender.shieldUntil = new Date(Date.now() + 12 * 60 * 60 * 1000);
            await this.userRepository.save(defender);
        }
        
        // 生成奖励选项
        const rewardOptions = isWin ? this.generateRewards(defender) : null;
        
        return {
            battleId: battle.id,
            attackerPower,
            defenderPower,
            winnerId: battle.winnerId,
            isWin,
            rewardOptions,
        };
    }
    
    private calculatePower(user: User): number {
        // 基础战力
        let power = user.level * 100;
        
        // 星系战力
        const galaxyPower = user.galaxies?.reduce((sum, g) => {
            return sum + g.level * 50 * this.getRarityMultiplier(g.rarity);
        }, 0) || 0;
        
        // 装备战力
        const equipmentPower = user.equipments?.reduce((sum, e) => {
            return sum + e.currentPower;
        }, 0) || 0;
        
        return power + galaxyPower + equipmentPower;
    }
    
    private getRarityMultiplier(rarity: number): number {
        const multipliers = [1, 1, 1.5, 2, 3];
        return multipliers[rarity] || 1;
    }
    
    private generateBattleRounds(attackerPower: number, defenderPower: number, attackerWin: boolean) {
        const rounds = [];
        const totalRounds = 10 + Math.floor(Math.random() * 10);
        
        for (let i = 0; i < totalRounds; i++) {
            rounds.push({
                round: i + 1,
                attackerDamage: Math.floor(attackerPower * 0.05 * (0.8 + Math.random() * 0.4)),
                defenderDamage: Math.floor(defenderPower * 0.05 * (0.8 + Math.random() * 0.4)),
            });
        }
        
        return rounds;
    }
    
    private generateRewards(defender: User) {
        const options = [];
        
        // 星系选项
        const satelliteGalaxies = defender.galaxies?.filter(g => !g.isMain) || [];
        if (satelliteGalaxies.length > 0 && Math.random() < 0.3) {
            const galaxy = satelliteGalaxies[Math.floor(Math.random() * satelliteGalaxies.length)];
            options.push({
                type: 'galaxy',
                id: galaxy.id,
                name: galaxy.name,
            });
        }
        
        // 装备选项
        const equipments = defender.equipments?.filter(e => !e.isLocked) || [];
        if (equipments.length > 0 && Math.random() < 0.25) {
            const equipment = equipments[Math.floor(Math.random() * equipments.length)];
            options.push({
                type: 'equipment',
                id: equipment.id,
                name: equipment.equipment.name,
            });
        }
        
        // 资源选项
        options.push({
            type: 'resource',
            gold: defender.level * 50,
            emotions: [{ type: 1, amount: 50 }],
        });
        
        return options;
    }
}
```

---

## 四、配置文件

### 4.1 package.json（前端）

```json
{
    "name": "zodiac-empire-client",
    "version": "1.0.0",
    "description": "星座帝国 - 微信小游戏客户端",
    "scripts": {
        "start": "cocos run --platform wechat",
        "build": "cocos build --platform wechat"
    },
    "dependencies": {},
    "devDependencies": {
        "@types/node": "^20.0.0",
        "typescript": "^5.0.0"
    }
}
```

### 4.2 package.json（后端）

```json
{
    "name": "zodiac-empire-server",
    "version": "1.0.0",
    "description": "星座帝国 - 后端服务",
    "scripts": {
        "start": "nest start",
        "start:dev": "nest start --watch",
        "start:prod": "node dist/main",
        "build": "nest build",
        "test": "jest"
    },
    "dependencies": {
        "@nestjs/common": "^10.0.0",
        "@nestjs/core": "^10.0.0",
        "@nestjs/platform-express": "^10.0.0",
        "@nestjs/typeorm": "^10.0.0",
        "@nestjs/jwt": "^10.0.0",
        "@nestjs/passport": "^10.0.0",
        "@nestjs/config": "^3.0.0",
        "passport": "^0.6.0",
        "passport-jwt": "^4.0.1",
        "typeorm": "^0.3.0",
        "mysql2": "^3.0.0",
        "class-validator": "^0.14.0",
        "class-transformer": "^0.5.1",
        "axios": "^1.0.0",
        "bcrypt": "^5.1.0"
    },
    "devDependencies": {
        "@nestjs/cli": "^10.0.0",
        "@types/node": "^20.0.0",
        "@types/passport-jwt": "^4.0.0",
        "typescript": "^5.0.0"
    }
}
```

### 4.3 tsconfig.json（后端）

```json
{
    "compilerOptions": {
        "module": "commonjs",
        "declaration": true,
        "removeComments": true,
        "emitDecoratorMetadata": true,
        "experimentalDecorators": true,
        "allowSyntheticDefaultImports": true,
        "target": "ES2021",
        "sourceMap": true,
        "outDir": "./dist",
        "baseUrl": "./",
        "incremental": true,
        "skipLibCheck": true,
        "strictNullChecks": true,
        "noImplicitAny": true,
        "strictBindCallApply": true,
        "forceConsistentCasingInFileNames": true,
        "noFallthroughCasesInSwitch": true
    }
}
```

### 4.4 .env.example

```env
# 服务配置
PORT=3000
NODE_ENV=development

# 数据库配置
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=password
DB_DATABASE=zodiac_empire

# JWT配置
JWT_SECRET=your-super-secret-key-change-in-production
JWT_EXPIRES_IN=2h

# 微信配置
WECHAT_APPID=your-wechat-appid
WECHAT_SECRET=your-wechat-secret
```

---

## 五、开发指南

### 5.1 环境准备

```bash
# 1. 安装Node.js 20 LTS
nvm install 20
nvm use 20

# 2. 安装Cocos Creator 3.8.x
# 下载地址: https://www.cocos.com/creator

# 3. 安装后端依赖
cd server
npm install

# 4. 配置环境变量
cp .env.example .env
# 编辑.env文件，填写数据库和微信配置

# 5. 启动数据库（Docker）
docker run -d --name mysql \
    -p 3306:3306 \
    -e MYSQL_ROOT_PASSWORD=password \
    -e MYSQL_DATABASE=zodiac_empire \
    mysql:8

# 6. 启动后端服务
npm run start:dev
```

### 5.2 开发流程

```
1. 启动后端服务
   cd server && npm run start:dev

2. 用Cocos Creator打开client目录

3. 开发调试
   - 前端：Cocos Creator预览
   - 后端：Postman测试API

4. 构建
   - 前端：Cocos Creator构建微信小游戏
   - 后端：npm run build
```

---

**文档版本：** v1.0  
**创建日期：** 2026-03-09  
**作者：** 小科 🔬