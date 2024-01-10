import { Test, TestingModule } from '@nestjs/testing';
import { StatsService } from './stats.service';
import { PrismaService, Prisma } from '@reduced.to/prisma';

describe('StatsService', () => {
  let service: StatsService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    visit: {
      create: jest.fn(),
      findFirst: jest.fn(),
      findByURL: jest.fn(),
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
      mockPrismaService.visit.create.mockRejectedValue(new Error('Unexpected error'));
      await expect(
        service.addVisit('testKey', { hashedIp: 'testIp', ua: 'testAgent', geoLocation: { country: 'United States' } })
      ).rejects.toThrow('Unexpected error');
    });
  });

  describe('isUniqueVisit', () => {
    it('should return true for a unique visit', async () => {
      mockPrismaService.visit.findFirst.mockResolvedValue(null);
      await expect(service.isUniqueVisit('testKey', 'testIp')).resolves.toBeTruthy();
    });

    it('should return false for a non-unique visit', async () => {
      mockPrismaService.visit.findFirst.mockResolvedValue({ id: 1 });
      await expect(service.isUniqueVisit('testKey', 'testIp')).resolves.toBeFalsy();
    });
  });

  describe('getVisits', () => {
    it('should return all vists of a specific url', async () => {
      mockPrismaService.visit.findByURL.mockResolvedValue({});
      await expect(service.findByURL('testURL')).resolves.toBeTruthy();
      //probably made a mess here - let me know
    });

    it('should throw an error for unexpected errors', async () => {
      mockPrismaService.visit.findByURL.mockRejectedValue(new Error('Unexpected error'));
      await expect(
        service.findByURL('testURL')
      ).rejects.toThrow('Unexpected error');
    });
  })
});
