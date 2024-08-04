// Unit tests for: validateUser

import * as bcrypt from 'bcryptjs';

import { AuthService } from '../auth.service';

class MockPrismaService {
  public user = {
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  };
}

class MockJwtService {
  public sign = jest.fn();
}

class MockStorageService {
  public delete = jest.fn();
}

class MockAppConfigService {
  public getConfig = jest.fn().mockReturnValue({
    auth: {
      jwt: {
        refreshSecret: 'refreshSecret',
      },
    },
  });
}

class MockBillingService {
  public cancelSubscription = jest.fn();
}

describe('AuthService.validateUser() validateUser method', () => {
  let authService: AuthService;
  let mockPrismaService: MockPrismaService;
  let mockJwtService: MockJwtService;
  let mockStorageService: MockStorageService;
  let mockAppConfigService: MockAppConfigService;
  let mockBillingService: MockBillingService;

  beforeEach(() => {
    mockPrismaService = new MockPrismaService();
    mockJwtService = new MockJwtService();
    mockStorageService = new MockStorageService();
    mockAppConfigService = new MockAppConfigService();
    mockBillingService = new MockBillingService();

    authService = new AuthService(
      mockPrismaService as any,
      mockJwtService as any,
      mockStorageService as any,
      mockAppConfigService as any,
      mockBillingService as any
    );
  });

  describe('Happy Path', () => {
    it('should return user data when valid email and password are provided', async () => {
      const email = 'test@example.com';
      const password = 'password';
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = {
        id: '1',
        email,
        password: hashedPassword,
        subscription: { plan: 'PREMIUM' },
      };

      mockPrismaService.user.findUnique.mockResolvedValue(user as any);

      const result = await authService.validateUser(email, password);

      expect(result).toEqual({
        id: '1',
        email: 'test@example.com',
        password: hashedPassword,
        plan: 'PREMIUM',
        subscription: { plan: 'PREMIUM' },
      });
    });
  });

  describe('Edge Cases', () => {
    it('should return null if user is not found', async () => {
      const email = 'notfound@example.com';
      const password = 'password';

      mockPrismaService.user.findUnique.mockResolvedValue(null);

      const result = await authService.validateUser(email, password);

      expect(result).toBeNull();
    });

    // it('should return null if password is incorrect', async () => {
    //   const email = 'test@example.com';
    //   const password = 'wrongpassword';
    //   const hashedPassword = await bcrypt.hash('correctpassword', 10);
    //   const user = {
    //     id: '1',
    //     email,
    //     password: hashedPassword,
    //     subscription: { plan: 'PREMIUM' },
    //   };

    //   mockPrismaService.user.findUnique.mockResolvedValue(user as any);
    //   jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

    //   const result = await authService.validateUser(email, password);

    //   expect(result).toBeNull();
    // });

    // it('should handle errors from bcrypt.compare gracefully', async () => {
    //   const email = 'test@example.com';
    //   const password = 'password';
    //   const hashedPassword = await bcrypt.hash(password, 10);
    //   const user = {
    //     id: '1',
    //     email,
    //     password: hashedPassword,
    //     subscription: { plan: 'PREMIUM' },
    //   };

    //   mockPrismaService.user.findUnique.mockResolvedValue(user as any);
    //   jest.spyOn(bcrypt, 'compare').mockRejectedValue(new Error('Bcrypt error'));

    //   await expect(authService.validateUser(email, password)).rejects.toThrow();
    // });
  });
});

// End of unit tests for: validateUser
