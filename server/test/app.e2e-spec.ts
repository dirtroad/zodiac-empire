import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('API E2E Tests', () => {
  let app: INestApplication;
  let accessToken: string;
  let userId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('认证模块', () => {
    it('POST /v1/auth/wechat/login - 微信登录', async () => {
      const response = await request(app.getHttpServer())
        .post('/v1/auth/wechat/login')
        .send({ code: 'test_code' })
        .expect(201);

      expect(response.body).toHaveProperty('code', 0);
      expect(response.body.data).toHaveProperty('access_token');
      expect(response.body.data).toHaveProperty('user');
      expect(response.body.data).toHaveProperty('is_new_user');

      accessToken = response.body.data.access_token;
      userId = response.body.data.user.id;
    });

    it('GET /v1/users/me - 未授权访问', async () => {
      await request(app.getHttpServer())
        .get('/v1/users/me')
        .expect(401);
    });

    it('GET /v1/users/me - 已授权访问', async () => {
      const response = await request(app.getHttpServer())
        .get('/v1/users/me')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('code', 0);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data).toHaveProperty('nickname');
    });
  });

  describe('星系模块', () => {
    it('GET /v1/galaxies - 获取星系列表', async () => {
      const response = await request(app.getHttpServer())
        .get('/v1/galaxies')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('code', 0);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('POST /v1/galaxies - 创建星系', async () => {
      const response = await request(app.getHttpServer())
        .post('/v1/galaxies')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: '测试星系', type: 1 })
        .expect(201);

      expect(response.body).toHaveProperty('code', 0);
      expect(response.body.data).toHaveProperty('name', '测试星系');
    });
  });

  describe('装备模块', () => {
    it('GET /v1/equipment - 获取装备列表', async () => {
      const response = await request(app.getHttpServer())
        .get('/v1/equipment')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('code', 0);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('GET /v1/equipment/templates - 获取装备模板', async () => {
      const response = await request(app.getHttpServer())
        .get('/v1/equipment/templates')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('code', 0);
    });
  });

  describe('战斗模块', () => {
    it('GET /v1/battle/ranking - 获取排行榜', async () => {
      const response = await request(app.getHttpServer())
        .get('/v1/battle/ranking')
        .expect(200);

      expect(response.body).toHaveProperty('code', 0);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('五行模块', () => {
    it('GET /v1/wuxing/relations - 获取五行关系', async () => {
      const response = await request(app.getHttpServer())
        .get('/v1/wuxing/relations')
        .expect(200);

      expect(response.body).toHaveProperty('code', 0);
      expect(response.body.data).toHaveProperty('names');
      expect(response.body.data).toHaveProperty('sheng');
      expect(response.body.data).toHaveProperty('ke');
    });
  });

  describe('时空晶体模块', () => {
    it('GET /v1/time-crystal/balance - 获取晶体余额', async () => {
      const response = await request(app.getHttpServer())
        .get('/v1/time-crystal/balance')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('code', 0);
    });
  });

  describe('地图模块', () => {
    it('GET /v1/map/constellation - 获取星座地图', async () => {
      const response = await request(app.getHttpServer())
        .get('/v1/map/constellation')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('code', 0);
      expect(response.body.data).toHaveProperty('realms');
      expect(response.body.data).toHaveProperty('zones');
    });
  });
});