import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { createClient } from 'redis';

import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { GalaxyModule } from './modules/galaxy/galaxy.module';
import { EquipmentModule } from './modules/equipment/equipment.module';
import { BattleModule } from './modules/battle/battle.module';
import { MarketModule } from './modules/market/market.module';
import { EmotionModule } from './modules/emotion/emotion.module';
import { TimebankModule } from './modules/timebank/timebank.module';
import { TeamModule } from './modules/team/team.module';
import { MapModule } from './modules/map/map.module';
import { WuxingModule } from './modules/wuxing/wuxing.module';
import { ChatModule } from './modules/chat/chat.module';
import { DungeonModule } from './modules/dungeon/dungeon.module';
import { DailySigninModule } from './modules/daily-signin/daily-signin.module';
import { RobotModule } from './modules/robot/robot.module';
import { WeddingModule } from './modules/wedding/wedding.module';
import { AwakeningModule } from './modules/zodiac-awakening/awakening.module';
import { CrystalMineModule } from './modules/crystal-mine/crystal-mine.module';
import { TutorialModule } from './modules/tutorial/tutorial.module';
import { EmotionLiveModule } from './modules/emotion-live/emotion-live.module';
import { ZodiacMatchModule } from './modules/zodiac-match/zodiac-match.module';
import { WandererUnionModule } from './modules/wanderer-union/wanderer-union.module';
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';
import { RedisService } from './common/redis/redis.service';

@Global()
@Module({
  imports: [
    // 配置模块
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),

    // 数据库模块
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get('DB_PORT', 3306),
        username: configService.get('DB_USERNAME', 'root'),
        password: configService.get('DB_PASSWORD', ''),
        database: configService.get('DB_DATABASE', 'zodiac_empire'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: configService.get('NODE_ENV') !== 'production',
        logging: configService.get('NODE_ENV') !== 'production',
        charset: 'utf8mb4_general_ci',
      }),
      inject: [ConfigService],
    }),

    // JWT模块
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET', 'default-secret'),
        signOptions: {
          expiresIn: configService.get('JWT_EXPIRES_IN', '7d'),
        },
      }),
      inject: [ConfigService],
    }),

    // 业务模块
    AuthModule,
    UserModule,
    GalaxyModule,
    EquipmentModule,
    BattleModule,
    MarketModule,
    EmotionModule,
    TimebankModule,
    TeamModule,
    MapModule,
    WuxingModule,
    ChatModule,
    DungeonModule,
    DailySigninModule,
    RobotModule,
    WeddingModule,
    AwakeningModule,
    CrystalMineModule,
    TutorialModule,
    EmotionLiveModule,
    ZodiacMatchModule,
    WandererUnionModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: 'REDIS_CLIENT',
      useFactory: async (configService: ConfigService) => {
        try {
          const client = createClient({
            url: `redis://${configService.get('REDIS_HOST', 'localhost')}:${configService.get('REDIS_PORT', 6379)}`,
          });
          await client.connect();
          console.log('✅ Redis connected');
          return client;
        } catch (e) {
          console.warn('⚠️ Redis not available, continuing without cache...');
          return null;
        }
      },
      inject: [ConfigService],
    },
    RedisService,
  ],
  exports: [RedisService],
})
export class AppModule {}