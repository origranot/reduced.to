import { Test, TestingModule } from '@nestjs/testing';
import { VisitsService } from './visits.service';
import { PrismaService, Prisma } from '@reduced.to/prisma';

describe('VisitsService', () => {
  let service: VisitsService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    $transaction: jest.fn(),
    visit: {
      create: jest.fn(),
      findFirst: jest.fn(),
      count: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VisitsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<VisitsService>(VisitsService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('addVisit', () => {
    it('should handle PrismaClientKnownRequestError', async () => {
      const error = new Prisma.PrismaClientKnownRequestError('message', { code: 'P2025', meta: {}, clientVersion: 'v1' });
      mockPrismaService.visit.create.mockRejectedValue(error);
      await expect(
        service.add('testKey', { hashedIp: 'testIp', ua: 'testAgent', geoLocation: { country: 'United States' } as any })
      ).resolves.toBeUndefined();
    });

    it('should throw an error for unexpected errors', async () => {
      mockPrismaService.$transaction.mockRejectedValue(new Error('Unexpected error'));
      await expect(
        service.add('testKey', { hashedIp: 'testIp', ua: 'testAgent', geoLocation: { country: 'United States' } as any })
      ).rejects.toThrow('Unexpected error');
    });
  });

  describe('isUniqueVisit', () => {
    it('should return true for a unique visit', async () => {
      mockPrismaService.visit.count.mockResolvedValue(0);
      await expect(service.isUnique('testKey', 'testIp')).resolves.toBeTruthy();
    });

    it('should return false for a non-unique visit', async () => {
      mockPrismaService.visit.count.mockResolvedValue(1);
      await expect(service.isUnique('testKey', 'testIp')).resolves.toBeFalsy();
    });
  });
});
