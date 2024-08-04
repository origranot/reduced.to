// Unit tests for: isUnique

import { VisitsService } from '../visits.service';

class MockPrismaService {
  public visit = {
    count: jest.fn(),
  };

  constructor() {}
}

describe('VisitsService.isUnique() isUnique method', () => {
  let service: VisitsService;
  let mockPrismaService: MockPrismaService;

  beforeEach(() => {
    mockPrismaService = new MockPrismaService() as any;
    service = new VisitsService(mockPrismaService as any);
  });

  describe('Happy Path', () => {
    it('should return true when there are no visits for the given key and hashedIp', async () => {
      // Arrange
      const key = 'test-key';
      const hashedIp = 'hashed-ip-1';
      mockPrismaService.visit.count.mockResolvedValue(0 as any);

      // Act
      const result = await service.isUnique(key, hashedIp);

      // Assert
      expect(result).toBe(true);
      expect(mockPrismaService.visit.count).toHaveBeenCalledWith({
        where: {
          ip: hashedIp,
          link: { key },
        },
      });
    });

    it('should return false when there is at least one visit for the given key and hashedIp', async () => {
      // Arrange
      const key = 'test-key';
      const hashedIp = 'hashed-ip-2';
      mockPrismaService.visit.count.mockResolvedValue(1 as any);

      // Act
      const result = await service.isUnique(key, hashedIp);

      // Assert
      expect(result).toBe(false);
      expect(mockPrismaService.visit.count).toHaveBeenCalledWith({
        where: {
          ip: hashedIp,
          link: { key },
        },
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle the case when count returns a negative number', async () => {
      // Arrange
      const key = 'test-key';
      const hashedIp = 'hashed-ip-3';
      mockPrismaService.visit.count.mockResolvedValue(-1 as any);

      // Act
      const result = await service.isUnique(key, hashedIp);

      // Assert
      expect(result).toBe(false); // Assuming we treat negative counts as non-unique
      expect(mockPrismaService.visit.count).toHaveBeenCalledWith({
        where: {
          ip: hashedIp,
          link: { key },
        },
      });
    });

    it('should handle the case when count returns a very large number', async () => {
      // Arrange
      const key = 'test-key';
      const hashedIp = 'hashed-ip-4';
      mockPrismaService.visit.count.mockResolvedValue(1000000 as any);

      // Act
      const result = await service.isUnique(key, hashedIp);

      // Assert
      expect(result).toBe(false);
      expect(mockPrismaService.visit.count).toHaveBeenCalledWith({
        where: {
          ip: hashedIp,
          link: { key },
        },
      });
    });

    it('should handle errors thrown by the count method', async () => {
      // Arrange
      const key = 'test-key';
      const hashedIp = 'hashed-ip-5';
      mockPrismaService.visit.count.mockRejectedValue(new Error('Database error') as never);

      // Act & Assert
      await expect(service.isUnique(key, hashedIp)).rejects.toThrow('Database error');
      expect(mockPrismaService.visit.count).toHaveBeenCalledWith({
        where: {
          ip: hashedIp,
          link: { key },
        },
      });
    });
  });
});

// End of unit tests for: isUnique
