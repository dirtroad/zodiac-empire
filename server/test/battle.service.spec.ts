import { Test, TestingModule } from '@nestjs/testing';
import { BattleService } from '../src/modules/battle/battle.service';
import { User } from '../src/entities/user.entity';
import { Galaxy } from '../src/entities/galaxy.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException, ForbiddenException } from '@nestjs/common';

describe('BattleService', () => {
  let service: BattleService;
  let mockUserRepository: any;
  let mockGalaxyRepository: any;

  beforeEach(async () => {
    mockUserRepository = {
      findOne: jest.fn(),
      find: jest.fn(),
      createQueryBuilder: jest.fn().mockReturnValue({
        where: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        getMany: jest.fn(),
      }),
      increment: jest.fn(),
      decrement: jest.fn(),
    };

    mockGalaxyRepository = {
      find: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BattleService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: getRepositoryToken(Galaxy),
          useValue: mockGalaxyRepository,
        },
      ],
    }).compile();

    service = module.get<BattleService>(BattleService);
  });

  it('服务应该被定义', () => {
    expect(service).toBeDefined();
  });

  describe('startBattle', () => {
    it('应该成功发起战斗', async () => {
      const mockAttacker = {
        id: 1,
        power: 1000,
        zodiacSign: 1,
        shieldUntil: null,
      };
      const mockDefender = {
        id: 2,
        power: 800,
        zodiacSign: 2,
        shieldUntil: null,
      };

      mockUserRepository.findOne
        .mockResolvedValueOnce(mockAttacker)
        .mockResolvedValueOnce(mockDefender);

      const result = await service.startBattle(1, 2);

      expect(result.attacker.id).toBe(1);
      expect(result.defender.id).toBe(2);
      expect(result.battleId).toBeDefined();
    });

    it('攻击者不存在应该抛出异常', async () => {
      mockUserRepository.findOne.mockResolvedValueOnce(null);

      await expect(service.startBattle(999, 2)).rejects.toThrow(NotFoundException);
    });

    it('目标玩家不存在应该抛出异常', async () => {
      mockUserRepository.findOne
        .mockResolvedValueOnce({ id: 1 })
        .mockResolvedValueOnce(null);

      await expect(service.startBattle(1, 999)).rejects.toThrow(NotFoundException);
    });

    it('目标玩家有护盾应该抛出异常', async () => {
      const mockAttacker = { id: 1, power: 1000 };
      const mockDefender = {
        id: 2,
        power: 800,
        shieldUntil: new Date(Date.now() + 3600000), // 1小时后
      };

      mockUserRepository.findOne
        .mockResolvedValueOnce(mockAttacker)
        .mockResolvedValueOnce(mockDefender);

      await expect(service.startBattle(1, 2)).rejects.toThrow(ForbiddenException);
    });
  });

  describe('getRanking', () => {
    it('应该返回战力排行榜', async () => {
      const mockUsers = [
        { id: 1, nickname: '玩家1', power: 5000 },
        { id: 2, nickname: '玩家2', power: 4000 },
        { id: 3, nickname: '玩家3', power: 3000 },
      ];

      mockUserRepository.find.mockResolvedValue(mockUsers);

      const result = await service.getRanking();
      expect(result).toEqual(mockUsers);
      expect(mockUserRepository.find).toHaveBeenCalledWith({
        order: { power: 'DESC' },
        take: 100,
        select: ['id', 'nickname', 'power', 'zodiacSign', 'level'],
      });
    });
  });

  describe('getHistory', () => {
    it('应该返回战斗历史（空数组）', async () => {
      const result = await service.getHistory(1);
      expect(result).toEqual([]);
    });
  });
});