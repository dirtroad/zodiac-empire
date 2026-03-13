import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../src/modules/user/user.service';
import { User } from '../src/entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';

describe('UserService', () => {
  let service: UserService;
  let mockUserRepository: any;

  beforeEach(async () => {
    mockUserRepository = {
      findOne: jest.fn(),
      update: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('服务应该被定义', () => {
    expect(service).toBeDefined();
  });

  describe('findById', () => {
    it('应该返回用户信息', async () => {
      const mockUser = {
        id: 1,
        openid: 'test_openid',
        nickname: '测试用户',
        level: 5,
        power: 1000,
      };

      mockUserRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.findById(1);
      expect(result).toEqual(mockUser);
    });

    it('用户不存在应该抛出异常', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.findById(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByOpenid', () => {
    it('应该通过 openid 查找用户', async () => {
      const mockUser = {
        id: 1,
        openid: 'test_openid',
        nickname: '测试用户',
      };

      mockUserRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.findByOpenid('test_openid');
      expect(result).toEqual(mockUser);
    });

    it('用户不存在应该返回 null', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      const result = await service.findByOpenid('nonexistent');
      expect(result).toBeNull();
    });
  });

  describe('updateProfile', () => {
    it('应该更新用户资料', async () => {
      const mockUser = {
        id: 1,
        nickname: '旧昵称',
        avatarUrl: 'old_url',
      };

      const updatedUser = {
        id: 1,
        nickname: '新昵称',
        avatarUrl: 'new_url',
      };

      mockUserRepository.update.mockResolvedValue({});
      mockUserRepository.findOne.mockResolvedValue(updatedUser);

      const result = await service.updateProfile(1, {
        nickname: '新昵称',
        avatarUrl: 'new_url',
      });

      expect(mockUserRepository.update).toHaveBeenCalledWith(1, {
        nickname: '新昵称',
        avatarUrl: 'new_url',
      });
    });
  });

  describe('getUserInfo', () => {
    it('应该返回完整的用户信息', async () => {
      const mockUser = {
        id: 1,
        openid: 'test_openid',
        nickname: '测试用户',
        avatarUrl: 'avatar_url',
        level: 10,
        exp: 5000,
        power: 2000,
        gold: 10000,
        diamond: 100,
        timeCoin: 50,
        zodiacSign: 3,
        zodiacName: '双子座',
        vipLevel: 1,
        createdAt: new Date('2026-01-01'),
      };

      mockUserRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.getUserInfo(1);

      expect(result.id).toBe(1);
      expect(result.nickname).toBe('测试用户');
      expect(result.level).toBe(10);
      expect(result.zodiacSign).toBe(3);
      // 敏感字段不应该返回
      expect(result).not.toHaveProperty('openid');
    });
  });
});