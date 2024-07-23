import { AppLoggerService } from '@reduced.to/logger';
import { PrismaService } from '@reduced.to/prisma';
import { AnalyticsService } from '../analytics.service';
import { Test, TestingModule } from '@nestjs/testing';

class MockAppLoggerService {
  log = jest.fn();
  error = jest.fn();
  warn = jest.fn();
}

class MockPrismaService {
  visit = {
    count: jest.fn(),
  };
}

describe('AnalyticsService.getTotalVisits() getTotalVisits method', () => {
  let service: AnalyticsService;
  let mockLogger: MockAppLoggerService;
  let mockPrisma: MockPrismaService;

  beforeEach(async () => {
    mockLogger = new MockAppLoggerService();
    mockPrisma = new MockPrismaService();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnalyticsService,
        { provide: AppLoggerService, useValue: mockLogger as any },
        { provide: PrismaService, useValue: mockPrisma as any },
      ],
    }).compile();

    service = module.get<AnalyticsService>(AnalyticsService);
  });

  describe('Happy Path', () => {
    it('should return the total number of visits for a given key and userId', async () => {
      // Arrange
      const key = 'testKey';
      const userId = 'testUserId';
      const expectedCount = 42;

      mockPrisma.visit.count.mockResolvedValue(expectedCount as never);

      // Act
      const result = await service.getTotalVisits(key, userId);

      // Assert
      expect(result).toBe(expectedCount);
      expect(mockPrisma.visit.count).toHaveBeenCalledWith({
        where: {
          link: {
            key,
            userId,
          },
        },
      });
    });
  });

  describe('Edge Cases', () => {
    it('should return 0 if no visits are found for the given key and userId', async () => {
      // Arrange
      const key = 'nonExistentKey';
      const userId = 'nonExistentUserId';
      const expectedCount = 0;

      mockPrisma.visit.count.mockResolvedValue(expectedCount as never);

      // Act
      const result = await service.getTotalVisits(key, userId);

      // Assert
      expect(result).toBe(expectedCount);
      expect(mockPrisma.visit.count).toHaveBeenCalledWith({
        where: {
          link: {
            key,
            userId,
          },
        },
      });
    });
  });
});
