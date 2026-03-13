import { Injectable, Inject } from '@nestjs/common';
import { RedisClientType } from 'redis';

@Injectable()
export class RedisService {
  constructor(
    @Inject('REDIS_CLIENT')
    private redisClient: RedisClientType | null,
  ) {}

  private checkClient() {
    if (!this.redisClient) {
      throw new Error('Redis is not available. Please start Redis server.');
    }
  }

  // 设置键值
  async set(key: string, value: string, ttl?: number): Promise<void> {
    this.checkClient();
    if (ttl) {
      await this.redisClient!.setEx(key, ttl, value);
    } else {
      await this.redisClient!.set(key, value);
    }
  }

  // 获取值
  async get(key: string): Promise<string | null> {
    this.checkClient();
    return this.redisClient!.get(key);
  }

  // 删除键
  async del(key: string): Promise<number> {
    this.checkClient();
    return this.redisClient!.del(key);
  }

  // 检查键是否存在
  async exists(key: string): Promise<boolean> {
    this.checkClient();
    const result = await this.redisClient!.exists(key);
    return result === 1;
  }

  // 设置过期时间
  async expire(key: string, seconds: number): Promise<boolean> {
    this.checkClient();
    const result = await this.redisClient!.expire(key, seconds);
    return result === 1;
  }

  // 获取剩余过期时间
  async ttl(key: string): Promise<number> {
    this.checkClient();
    return this.redisClient!.ttl(key);
  }

  // 自增
  async incr(key: string): Promise<number> {
    this.checkClient();
    return this.redisClient!.incr(key);
  }

  // 自减
  async decr(key: string): Promise<number> {
    this.checkClient();
    return this.redisClient!.decr(key);
  }

  // 哈希操作
  async hset(key: string, field: string, value: string): Promise<number> {
    this.checkClient();
    return this.redisClient!.hSet(key, field, value);
  }

  async hget(key: string, field: string): Promise<string | null> {
    this.checkClient();
    return this.redisClient!.hGet(key, field);
  }

  async hgetall(key: string): Promise<Record<string, string>> {
    this.checkClient();
    return this.redisClient!.hGetAll(key);
  }

  async hdel(key: string, field: string): Promise<number> {
    this.checkClient();
    return this.redisClient!.hDel(key, field);
  }

  // 列表操作
  async lpush(key: string, value: string): Promise<number> {
    this.checkClient();
    return this.redisClient!.lPush(key, value);
  }

  async rpush(key: string, value: string): Promise<number> {
    this.checkClient();
    return this.redisClient!.rPush(key, value);
  }

  async lpop(key: string): Promise<string | null> {
    this.checkClient();
    return this.redisClient!.lPop(key);
  }

  async rpop(key: string): Promise<string | null> {
    this.checkClient();
    return this.redisClient!.rPop(key);
  }

  async lrange(key: string, start: number, stop: number): Promise<string[]> {
    this.checkClient();
    return this.redisClient!.lRange(key, start, stop);
  }

  async llen(key: string): Promise<number> {
    this.checkClient();
    return this.redisClient!.lLen(key);
  }

  // 有序集合操作
  async zadd(key: string, score: number, member: string): Promise<number> {
    this.checkClient();
    return this.redisClient!.zAdd(key, { score, value: member });
  }

  async zrange(key: string, start: number, stop: number): Promise<string[]> {
    this.checkClient();
    return this.redisClient!.zRange(key, start, stop);
  }

  async zrevrange(key: string, start: number, stop: number): Promise<string[]> {
    this.checkClient();
    return this.redisClient!.zRange(key, start, stop, { REV: true });
  }

  async zrank(key: string, member: string): Promise<number | null> {
    this.checkClient();
    const result = await this.redisClient!.zRank(key, member);
    return result;
  }

  async zscore(key: string, member: string): Promise<number | null> {
    this.checkClient();
    const result = await this.redisClient!.zScore(key, member);
    return result;
  }
}