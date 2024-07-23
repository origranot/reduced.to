// Unit tests for: updateById

import { Prisma, User } from '@reduced.to/prisma';

import { UsersService } from '../users.service';

class MockPrismaService {
  public user = {
    update: jest.fn(),
  };
}

describe('UsersService.updateById() updateById method', () => {
  let usersService: UsersService;
  let mockPrismaService: MockPrismaService;

  beforeEach(() => {
    mockPrismaService = new MockPrismaService();
    usersService = new UsersService(mockPrismaService as any);
  });

  describe('Happy Path', () => {
    it('should update a user by ID and return the updated user', async () => {
      // Arrange
      const userId = '123';
      const updateData: Prisma.UserUpdateInput = { name: 'New Name' };
      const updatedUser: User = { id: userId, name: 'New Name', email: 'test@example.com', verified: true, createdAt: new Date() };

      mockPrismaService.user.update.mockResolvedValue(updatedUser as any);

      // Act
      const result = await usersService.updateById(userId, updateData);

      // Assert
      expect(result).toEqual(updatedUser);
      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: updateData,
      });
    });
  });

  describe('Edge Cases', () => {
    it('should throw an error if the user ID does not exist', async () => {
      // Arrange
      const userId = 'non-existent-id';
      const updateData: Prisma.UserUpdateInput = { name: 'New Name' };

      mockPrismaService.user.update.mockRejectedValue(new Error('User not found') as never);

      // Act & Assert
      await expect(usersService.updateById(userId, updateData)).rejects.toThrow('User not found');
      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: updateData,
      });
    });

    it('should handle empty update data gracefully', async () => {
      // Arrange
      const userId = '123';
      const updateData: Prisma.UserUpdateInput = {};
      const updatedUser: User = { id: userId, name: 'Old Name', email: 'test@example.com', verified: true, createdAt: new Date() };

      mockPrismaService.user.update.mockResolvedValue(updatedUser as any);

      // Act
      const result = await usersService.updateById(userId, updateData);

      // Assert
      expect(result).toEqual(updatedUser);
      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: updateData,
      });
    });

    it('should throw an error if the update data is invalid', async () => {
      // Arrange
      const userId = '123';
      const updateData: Prisma.UserUpdateInput = { email: 'invalid-email' }; // Assuming email validation fails

      mockPrismaService.user.update.mockRejectedValue(new Error('Invalid data') as never);

      // Act & Assert
      await expect(usersService.updateById(userId, updateData)).rejects.toThrow('Invalid data');
      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: updateData,
      });
    });
  });
});

// End of unit tests for: updateById
