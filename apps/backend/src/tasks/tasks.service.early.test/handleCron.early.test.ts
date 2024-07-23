// Unit tests for: handleCron

import { TasksService } from '../tasks.service';

class MockUsageService {
  public runOnAllActiveUsers = jest.fn();
  public resetUsage = jest.fn();
}

describe('TasksService.handleCron() handleCron method', () => {
  let tasksService: TasksService;
  let mockUsageService: MockUsageService;

  beforeEach(() => {
    mockUsageService = new MockUsageService() as any;
    tasksService = new TasksService(mockUsageService as any);
  });

  describe('Happy Path', () => {
    it('should call runOnAllActiveUsers with correct batch size', async () => {
      // Arrange
      mockUsageService.runOnAllActiveUsers.mockImplementation(async (batchSize, callback) => {
        // Simulate calling the callback with an array of user IDs
        await callback(['user1', 'user2']);
      });

      // Act
      await tasksService.handleCron();

      // Assert
      expect(mockUsageService.runOnAllActiveUsers).toHaveBeenCalledWith(1000, expect.any(Function));
    });

    it('should call resetUsage for each batch of user IDs', async () => {
      // Arrange
      const userIdsBatch = ['user1', 'user2'];
      mockUsageService.runOnAllActiveUsers.mockImplementation(async (batchSize, callback) => {
        await callback(userIdsBatch);
      });

      // Act
      await tasksService.handleCron();

      // Assert
      expect(mockUsageService.resetUsage).toHaveBeenCalledWith(userIdsBatch);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty user IDs gracefully', async () => {
      // Arrange
      mockUsageService.runOnAllActiveUsers.mockImplementation(async (batchSize, callback) => {
        await callback([]); // Simulate no user IDs
      });

      // Act
      await tasksService.handleCron();

      // Assert
      expect(mockUsageService.resetUsage).not.toHaveBeenCalled();
    });

    it('should handle errors thrown by resetUsage', async () => {
      // Arrange
      const userIdsBatch = ['user1', 'user2'];
      mockUsageService.runOnAllActiveUsers.mockImplementation(async (batchSize, callback) => {
        await callback(userIdsBatch);
      });
      mockUsageService.resetUsage.mockRejectedValue(new Error('Reset failed'));

      // Act & Assert
      await expect(tasksService.handleCron()).rejects.toThrow('Reset failed');
    });

    it('should handle errors thrown by runOnAllActiveUsers', async () => {
      // Arrange
      mockUsageService.runOnAllActiveUsers.mockRejectedValue(new Error('Fetch failed'));

      // Act & Assert
      await expect(tasksService.handleCron()).rejects.toThrow('Fetch failed');
    });
  });
});

// End of unit tests for: handleCron
