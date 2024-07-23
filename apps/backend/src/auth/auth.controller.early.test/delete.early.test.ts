// Unit tests for: delete

import { UnauthorizedException } from '@nestjs/common';

import { AuthController } from '../auth.controller';

describe('AuthController.delete() delete method', () => {
  let authController: AuthController;
  let mockPrismaService: MockPrismaService;
  let mockAuthService: MockAuthService;
  let mockNovuService: MockNovuService;
  let mockAppConfigService: MockAppConfigService;

  beforeEach(() => {
    mockPrismaService = new MockPrismaService();
    mockAuthService = new MockAuthService();
    mockNovuService = new MockNovuService();
    mockAppConfigService = new MockAppConfigService();

    authController = new AuthController(
      mockPrismaService as any,
      mockAuthService as any,
      mockNovuService as any,
      mockAppConfigService as any
    );
  });

  describe('Happy Path', () => {
    it('should successfully delete a user', async () => {
      // Arrange
      const mockUser: MockUserContext = { id: '123', email: 'test@example.com' } as any;
      mockAuthService.delete = jest.fn().mockResolvedValue(true);

      // Act
      const result = await authController.delete(mockUser as any);

      // Assert
      expect(mockAuthService.delete).toHaveBeenCalledWith(mockUser);
      expect(result).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    it('should throw an error if delete fails', async () => {
      // Arrange
      const mockUser: MockUserContext = { id: '123', email: 'test@example.com' } as any;
      mockAuthService.delete = jest.fn().mockRejectedValue(new Error('Delete failed'));

      // Act & Assert
      await expect(authController.delete(mockUser as any)).rejects.toThrow('Delete failed');
      expect(mockAuthService.delete).toHaveBeenCalledWith(mockUser);
    });

    it('should handle undefined user context gracefully', async () => {
      // Arrange
      const mockUser: MockUserContext = undefined as any;

      // Act & Assert
      await expect(authController.delete(mockUser as any)).rejects.toThrow(UnauthorizedException);
    });

    it('should handle null user context gracefully', async () => {
      // Arrange
      const mockUser: MockUserContext = null as any;

      // Act & Assert
      await expect(authController.delete(mockUser as any)).rejects.toThrow(UnauthorizedException);
    });
  });
});

// Mock classes
interface MockUserContext {
  id: string;
  email: string;
}

class MockPrismaService {
  // Mock methods and properties as needed
}

class MockAuthService {
  delete = jest.fn();
}

class MockNovuService {
  // Mock methods and properties as needed
}

class MockAppConfigService {
  // Mock methods and properties as needed
}

// End of unit tests for: delete
