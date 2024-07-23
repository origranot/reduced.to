// Unit tests for: validate

import { UnauthorizedException } from '@nestjs/common';

import { LocalStrategy } from '../local.strategy';

class MockAuthService {
  public validateUser = jest.fn();
}

describe('LocalStrategy.validate() validate method', () => {
  let localStrategy: LocalStrategy;
  let mockAuthService: MockAuthService;

  beforeEach(() => {
    mockAuthService = new MockAuthService();
    localStrategy = new LocalStrategy(mockAuthService as any);
  });

  describe('validate', () => {
    it('should return user when valid credentials are provided', async () => {
      // Arrange
      const email = 'test@example.com';
      const password = 'password';
      const mockUser = { id: 1, email: 'test@example.com' };
      mockAuthService.validateUser.mockResolvedValue(mockUser as any);

      // Act
      const result = await localStrategy.validate(email, password);

      // Assert
      expect(result).toEqual(mockUser);
      expect(mockAuthService.validateUser).toHaveBeenCalledWith(email, password);
    });

    it('should throw UnauthorizedException when invalid credentials are provided', async () => {
      // Arrange
      const email = 'test@example.com';
      const password = 'wrongpassword';
      mockAuthService.validateUser.mockResolvedValue(null as any);

      // Act & Assert
      await expect(localStrategy.validate(email, password)).rejects.toThrow(UnauthorizedException);
      expect(mockAuthService.validateUser).toHaveBeenCalledWith(email, password);
    });

    it('should throw UnauthorizedException when user is not found', async () => {
      // Arrange
      const email = 'nonexistent@example.com';
      const password = 'password';
      mockAuthService.validateUser.mockResolvedValue(null as any);

      // Act & Assert
      await expect(localStrategy.validate(email, password)).rejects.toThrow(UnauthorizedException);
      expect(mockAuthService.validateUser).toHaveBeenCalledWith(email, password);
    });

    it('should handle unexpected errors from AuthService', async () => {
      // Arrange
      const email = 'test@example.com';
      const password = 'password';
      const errorMessage = 'Unexpected error';
      mockAuthService.validateUser.mockRejectedValue(new Error(errorMessage) as never);

      // Act & Assert
      await expect(localStrategy.validate(email, password)).rejects.toThrow(Error);
      expect(mockAuthService.validateUser).toHaveBeenCalledWith(email, password);
    });
  });
});

// End of unit tests for: validate
