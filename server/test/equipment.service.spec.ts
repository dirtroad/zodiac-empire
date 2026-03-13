import { Test, TestingModule } from '@nestjs/testing';
import { EquipmentService } from '../src/modules/equipment/equipment.service';
import { UserEquipment } from '../src/entities/user-equipment.entity';
import { EquipmentTemplate } from '../src/entities/equipment-template.entity';
import { User } from '../src/entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('EquipmentService', () => {
  let service: EquipmentService;
  let mockUserEquipmentRepository: any;
  let mockTemplateRepository: any;
  let mockUserRepository: any;

  beforeEach(async () => {
    mockUserEquipmentRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
    };

    mockTemplateRepository = {
      find: jest.fn(),
    };

    mockUserRepository = {
      findOne: jest.fn(),
      update: jest.fn(),
      increment: jest.fn(),
      decrement: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EquipmentService,
        {
          provide: getRepositoryToken(UserEquipment),
          useValue: mockUserEquipmentRepository,
        },
        {
          provide: getRepositoryToken(EquipmentTemplate),
          useValue: mockTemplateRepository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<EquipmentService>(EquipmentService);
  });

  it('服务应该被定义', () => {
    expect(service).toBeDefined();
  });

  describe('findByUserId', () => {
    it('应该返回用户的装备列表', async () => {
      const mockEquipment = [
        { id: 1, userId: 1, name: '装备1', rarity: 1 },
        { id: 2, userId: 1, name: '装备2', rarity: 2 },
      ];

      mockUserEquipmentRepository.find.mockResolvedValue(mockEquipment);

      const result = await service.findByUserId(1);
      expect(result).toEqual(mockEquipment);
    });
  });

  describe('equip', () => {
    it('应该成功穿戴装备', async () => {
      const mockEquipment = {
        id: 1,
        userId: 1,
        name: '测试装备',
        isEquipped: false,
        equippedSlot: null,
      };

      mockUserEquipmentRepository.findOne.mockResolvedValue(mockEquipment);
      mockUserEquipmentRepository.update.mockResolvedValue({});
      mockUserEquipmentRepository.save.mockResolvedValue({
        ...mockEquipment,
        isEquipped: true,
        equippedSlot: 1,
      });

      const result = await service.equip(1, 1, 1);
      expect(result.isEquipped).toBe(true);
      expect(result.equippedSlot).toBe(1);
    });
  });
});