// Unit tests for: runOnAllActiveUsers

import { UsageService } from '../usage.service';

class MockPrismaService {
  public usage = {
    updateMany: jest.fn(),
    update: jest.fn(),
    findUnique: jest.fn(),
  };

  public user = {
    findMany: jest.fn(),
  };
}

describe('UsageService.runOnAllActiveUsers() runOnAllActiveUsers method', () => {
  let usageService: UsageService;
  let mockPrismaService: MockPrismaService;

  beforeEach(() => {
    mockPrismaService = new MockPrismaService();
    usageService = new UsageService(mockPrismaService as any);
  });

  describe('Happy Path', () => {
    it('should process all active users in batches', async () => {
      // Arrange
      const batchSize = 2;
      mockPrismaService.user.findMany
        .mockResolvedValueOnce([{ id: 'user1' }, { id: 'user2' }])
        .mockResolvedValueOnce([{ id: 'user3' }])
        .mockResolvedValueOnce([]); // No more users

      const callback = jest.fn();

      // Act
      await usageService.runOnAllActiveUsers(batchSize, callback);

      // Assert
      expect(mockPrismaService.user.findMany).toHaveBeenCalledTimes(3);
      expect(callback).toHaveBeenCalledTimes(3);
      expect(callback).toHaveBeenCalledWith(['user1', 'user2']);
      expect(callback).toHaveBeenCalledWith(['user3']);
    });
  });

  describe('Edge Cases', () => {
    it('should handle no active users', async () => {
      // Arrange
      const batchSize = 2;
      mockPrismaService.user.findMany.mockResolvedValueOnce([]); // No users

      const callback = jest.fn();

      // Act
      await usageService.runOnAllActiveUsers(batchSize, callback);

      // Assert
      expect(mockPrismaService.user.findMany).toHaveBeenCalledTimes(1);
      expect(callback).not.toHaveBeenCalled();
    });

    it('should stop processing on error', async () => {
      // Arrange
      const batchSize = 2;
      mockPrismaService.user.findMany
        .mockResolvedValueOnce([{ id: 'user1' }, { id: 'user2' }])
        .mockRejectedValueOnce(new Error('Database error')); // Simulate error

      const callback = jest.fn();

      // Act
      await usageService.runOnAllActiveUsers(batchSize, callback);

      // Assert
      expect(mockPrismaService.user.findMany).toHaveBeenCalledTimes(2);
      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith(['user1', 'user2']);
    });

    it('should handle empty user IDs gracefully', async () => {
      // Arrange
      const batchSize = 2;
      mockPrismaService.user.findMany
        .mockResolvedValueOnce([{ id: 'user1' }, { id: 'user2' }])
        .mockResolvedValueOnce([{ id: 'user3' }])
        .mockResolvedValueOnce([]); // No more users

      const callback = jest.fn().mockResolvedValueOnce(undefined); // Simulate no operation

      // Act
      await usageService.runOnAllActiveUsers(batchSize, callback);

      // Assert
      expect(mockPrismaService.user.findMany).toHaveBeenCalledTimes(3);
      expect(callback).toHaveBeenCalledTimes(3);
      expect(callback).toHaveBeenCalledWith(['user1', 'user2']);
      expect(callback).toHaveBeenCalledWith(['user3']);
    });
  });
});

// End of unit tests for: runOnAllActiveUsers
