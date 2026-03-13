import { Test, TestingModule } from '@nestjs/testing';
import { GalaxyService } from '../src/modules/galaxy/galaxy.service';
import { Galaxy } from '../src/entities/galaxy.entity';
import { User } from '../src/entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('GalaxyService', () => {
  let service: GalaxyService;
  let mockGalaxyRepository: any;
  let mockUserRepository: any;

  beforeEach(async () => {
    mockGalaxyRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      count: jest.fn(),
    };

    mockUserRepository = {
      findOne: jest.fn(),
      update: jest.fn(),
      increment: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GalaxyService,
        {
          provide: getRepositoryToken(Galaxy),
          useValue: mockGalaxyRepository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<GalaxyService>(GalaxyService);
  });

  it('服务应该被定义', () => {
    expect(service).toBeDefined();
  });

  describe('findByUserId', () => {
    it('应该返回用户的星系列表', async () => {
      const mockGalaxies = [
        { id: 1, userId: 1, name: '星系1' },
        { id: 2, userId: 1, name: '星系2' },
      ];

      mockGalaxyRepository.find.mockResolvedValue(mockGalaxies);

      const result = await service.findByUserId(1);
      expect(result).toEqual(mockGalaxies);
      expect(mockGalaxyRepository.find).toHaveBeenCalledWith({
        where: { userId: 1 },
        order: { isMain: 'DESC', createdAt: 'ASC' },
      });
    });
  });

  describe('create', () => {
    it('应该成功创建星系', async () => {
      const mockUser = { id: 1, gold: 10000 };
      const mockGalaxy = { id: 1, userId: 1, name: '测试星系' };

      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockGalaxyRepository.count.mockResolvedValue(0);
      mockGalaxyRepository.create.mockReturnValue(mockGalaxy);
      mockGalaxyRepository.save.mockResolvedValue(mockGalaxy);
      mockUserRepository.update.mockResolvedValue({});

      const result = await service.create(1, { name: '测试星系' });
      expect(result).toEqual(mockGalaxy);
    });
  });
});