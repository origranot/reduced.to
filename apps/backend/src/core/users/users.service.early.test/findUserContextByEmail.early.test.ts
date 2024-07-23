// Unit tests for: findUserContextByEmail

import { UsersService } from '../users.service';

class MockSubscription {
  public plan: string = 'FREE';
}

class MockUser {
  public id: string = '1';
  public name: string = 'John Doe';
  public email: string = 'john.doe@example.com';
  public verified: boolean = true;
  public createdAt: Date = new Date();
  public password?: string;
  public refreshToken?: string;
  public subscription?: MockSubscription;
}

class MockPrismaService {
  public user = {
    findUnique: jest.fn(),
  };
}

describe('UsersService.findUserContextByEmail() findUserContextByEmail method', () => {
  let usersService: UsersService;
  let mockPrismaService: MockPrismaService;

  beforeEach(() => {
    mockPrismaService = new MockPrismaService() as any;
    usersService = new UsersService(mockPrismaService as any);
  });

  describe('Happy Path', () => {
    it('should return a UserContext when a user is found by email', async () => {
      // Arrange
      const mockUser = new MockUser();
      mockUser.subscription = new MockSubscription();
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser as any);

      // Act
      const result = await usersService.findUserContextByEmail(mockUser.email);

      // Assert
      expect(result).toEqual({
        id: mockUser.id,
        name: mockUser.name,
        email: mockUser.email,
        verified: mockUser.verified,
        createdAt: mockUser.createdAt,
        plan: mockUser.subscription.plan,
      });
    });

    it('should return a UserContext with FREE plan when user has no subscription', async () => {
      // Arrange
      const mockUser = new MockUser();
      mockUser.subscription = undefined; // No subscription
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser as any);

      // Act
      const result = await usersService.findUserContextByEmail(mockUser.email);

      // Assert
      expect(result).toEqual({
        id: mockUser.id,
        name: mockUser.name,
        email: mockUser.email,
        verified: mockUser.verified,
        createdAt: mockUser.createdAt,
        plan: 'FREE',
      });
    });
  });

  describe('Edge Cases', () => {
    it('should return undefined when no user is found by email', async () => {
      // Arrange
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      // Act
      const result = await usersService.findUserContextByEmail('nonexistent@example.com');

      // Assert
      expect(result).toBeUndefined();
    });

    it('should handle an empty email string gracefully', async () => {
      // Arrange
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      // Act
      const result = await usersService.findUserContextByEmail('');

      // Assert
      expect(result).toBeUndefined();
    });

    it('should handle an email that is not a valid format', async () => {
      // Arrange
      const invalidEmail = 'invalid-email-format';
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      // Act
      const result = await usersService.findUserContextByEmail(invalidEmail);

      // Assert
      expect(result).toBeUndefined();
    });
  });
});

// End of unit tests for: findUserContextByEmail
