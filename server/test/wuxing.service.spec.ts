import { WuxingService } from '../src/modules/wuxing/wuxing.service';
import { Repository } from 'typeorm';
import { UserWuxing } from '../src/entities/user-wuxing.entity';
import { User } from '../src/entities/user.entity';

describe('WuxingService - 五行关系计算', () => {
  let service: WuxingService;
  let mockWuxingRepository: jest.Mocked<Repository<UserWuxing>>;
  let mockUserRepository: jest.Mocked<Repository<User>>;

  beforeEach(() => {
    mockWuxingRepository = {
      findOne: jest.fn(),
      find: jest.fn(),
      save: jest.fn(),
      create: jest.fn(),
    } as any;
    
    mockUserRepository = {
      findOne: jest.fn(),
      find: jest.fn(),
      save: jest.fn(),
      create: jest.fn(),
    } as any;
    
    service = new WuxingService(mockWuxingRepository, mockUserRepository);
  });

  describe('getWuxingRelations', () => {
    it('应该返回正确的五行关系', () => {
      const result = service.getWuxingRelations();

      expect(result).toHaveProperty('names');
      expect(result).toHaveProperty('sheng');
      expect(result).toHaveProperty('ke');
      expect(result.names[1]).toBe('金');
      expect(result.names[2]).toBe('木');
      expect(result.names[3]).toBe('水');
      expect(result.names[4]).toBe('火');
      expect(result.names[5]).toBe('土');
    });

    it('相生关系应该正确', () => {
      const result = service.getWuxingRelations();
      
      // 金生水
      expect(result.sheng[1]).toBe(3);
      // 水生木
      expect(result.sheng[3]).toBe(2);
      // 木生火
      expect(result.sheng[2]).toBe(4);
      // 火生土
      expect(result.sheng[4]).toBe(5);
      // 土生金
      expect(result.sheng[5]).toBe(1);
    });

    it('相克关系应该正确', () => {
      const result = service.getWuxingRelations();
      
      // 金克木
      expect(result.ke[1]).toBe(2);
      // 木克土
      expect(result.ke[2]).toBe(5);
      // 土克水
      expect(result.ke[5]).toBe(3);
      // 水克火
      expect(result.ke[3]).toBe(4);
      // 火克金
      expect(result.ke[4]).toBe(1);
    });
  });
});