import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../src/modules/auth/auth.service';
import { User } from '../src/entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

describe('AuthService', () => {
  let service: AuthService;
  let mockUserRepository: any;
  let mockJwtService: any;
  let mockConfigService: any;

  beforeEach(async () => {
    mockUserRepository = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };

    mockJwtService = {
      sign: jest.fn().mockReturnValue('mock_token'),
    };

    mockConfigService = {
      get: jest.fn().mockReturnValue('test_value'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('服务应该被定义', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('应该返回用户信息', async () => {
      const mockUser = {
        id: 1,
        openid: 'test_openid',
        status: 1,
      };

      mockUserRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.validateUser(1);
      expect(result).toEqual(mockUser);
    });

    it('用户不存在应该抛出异常', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.validateUser(1)).rejects.toThrow();
    });
  });
});