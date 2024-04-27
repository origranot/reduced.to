import { Test, TestingModule } from '@nestjs/testing';
import { StatsService } from './stats.service';
import { PrismaService, Prisma } from '@reduced.to/prisma';

describe('StatsService', () => {
  let service: StatsService;
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
        StatsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<StatsService>(StatsService);
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
        service.addVisit('testKey', { hashedIp: 'testIp', ua: 'testAgent', geoLocation: { country: 'United States' } })
      ).resolves.toBeUndefined();
    });

    it('should throw an error for unexpected errors', async () => {
      mockPrismaService.$transaction.mockRejectedValue(new Error('Unexpected error'));
      await expect(
        service.addVisit('testKey', { hashedIp: 'testIp', ua: 'testAgent', geoLocation: { country: 'United States' } })
      ).rejects.toThrow('Unexpected error');
    });
  });

  describe('isUniqueVisit', () => {
    it('should return true for a unique visit', async () => {
      mockPrismaService.visit.count.mockResolvedValue(0);
      await expect(service.isUniqueVisit('testKey', 'testIp')).resolves.toBeTruthy();
    });

    it('should return false for a non-unique visit', async () => {
      mockPrismaService.visit.count.mockResolvedValue(1);
      await expect(service.isUniqueVisit('testKey', 'testIp')).resolves.toBeFalsy();
    });
  });
});
