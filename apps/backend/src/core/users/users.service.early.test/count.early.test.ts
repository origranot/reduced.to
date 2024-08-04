// Unit tests for: count

import { UsersService } from '../users.service';

class MockPrismaService {
  public user = {
    count: jest.fn(),
  };
}

describe('UsersService.count() count method', () => {
  let usersService: UsersService;
  let mockPrismaService: MockPrismaService;

  beforeEach(() => {
    mockPrismaService = new MockPrismaService();
    usersService = new UsersService(mockPrismaService as any);
  });

  describe('Happy Path', () => {
    it('should return the correct count when called with no filters', async () => {
      // Arrange
      mockPrismaService.user.count.mockResolvedValue(10 as any);

      // Act
      const result = await usersService.count();

      // Assert
      expect(result).toBe(10);
      expect(mockPrismaService.user.count).toHaveBeenCalledWith({ where: undefined });
    });

    it('should return the correct count when called with filters', async () => {
      // Arrange
      const filters = { verified: true };
      mockPrismaService.user.count.mockResolvedValue(5 as any);

      // Act
      const result = await usersService.count(filters);

      // Assert
      expect(result).toBe(5);
      expect(mockPrismaService.user.count).toHaveBeenCalledWith({ where: filters });
    });

    it('should return the correct count when called with date filters', async () => {
      // Arrange
      const filters = { createdAt: { gte: new Date('2023-01-01'), lte: new Date('2023-12-31') } };
      mockPrismaService.user.count.mockResolvedValue(3 as any);

      // Act
      const result = await usersService.count(filters);

      // Assert
      expect(result).toBe(3);
      expect(mockPrismaService.user.count).toHaveBeenCalledWith({ where: filters });
    });
  });

  describe('Edge Cases', () => {
    it('should return 0 when there are no users', async () => {
      // Arrange
      mockPrismaService.user.count.mockResolvedValue(0 as any);

      // Act
      const result = await usersService.count();

      // Assert
      expect(result).toBe(0);
      expect(mockPrismaService.user.count).toHaveBeenCalledWith({ where: undefined });
    });

    it('should handle errors thrown by the Prisma service', async () => {
      // Arrange
      mockPrismaService.user.count.mockRejectedValue(new Error('Database error'));

      // Act & Assert
      await expect(usersService.count()).rejects.toThrow('Database error');
    });

    it('should handle filters with invalid types gracefully', async () => {
      // Arrange
      const filters = { verified: 'not-a-boolean' as any }; // Invalid type
      mockPrismaService.user.count.mockResolvedValue(0 as any);

      // Act
      const result = await usersService.count(filters);

      // Assert
      expect(result).toBe(0);
      expect(mockPrismaService.user.count).toHaveBeenCalledWith({ where: filters });
    });
  });
});

// End of unit tests for: count
