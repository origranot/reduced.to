// Unit tests for: delete

import { Role } from '@reduced.to/prisma';

import { PROFILE_PICTURE_PREFIX } from '../../storage/storage.service';

import { AuthService } from '../auth.service';

interface MockUserContext {
  id: string;
  email: string;
  name: string;
  role: Role;
  verified: boolean;
  plan?: string;
}

class MockPrismaService {
  user = {
    findUnique: jest.fn(),
    delete: jest.fn(),
    update: jest.fn(),
  };
}

class MockJwtService {
  sign = jest.fn();
}

class MockStorageService {
  delete = jest.fn();
}

class MockAppConfigService {
  getConfig = jest.fn().mockReturnValue({
    auth: {
      jwt: {
        refreshSecret: 'refreshSecret',
      },
    },
  });
}

class MockBillingService {
  cancelSubscription = jest.fn();
}

describe('AuthService.delete() delete method', () => {
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

  it('should delete a user and their profile picture successfully', async () => {
    // Arrange
    const userCtx: MockUserContext = { id: '1', email: 'test@example.com', name: 'Test User', role: Role.USER, verified: true };
    const userFromDb = {
      id: '1',
      email: 'test@example.com',
      name: 'Test User',
      subscription: null,
    };

    mockPrismaService.user.findUnique.mockResolvedValue(userFromDb as any);
    mockStorageService.delete.mockResolvedValue(undefined);
    mockPrismaService.user.delete.mockResolvedValue(userFromDb as any);

    // Act
    const result = await authService.delete(userCtx as any);

    // Assert
    expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
      where: { id: userCtx.id },
      include: { subscription: true },
    });
    expect(mockStorageService.delete).toHaveBeenCalledWith(`${PROFILE_PICTURE_PREFIX}/${userFromDb.id}`);
    expect(mockPrismaService.user.delete).toHaveBeenCalledWith({
      where: { id: userFromDb.id },
      include: { authProviders: true, links: true },
    });
    expect(result).toEqual(userFromDb);
  });

  it('should delete a user and cancel their subscription if they have one', async () => {
    // Arrange
    const userCtx: MockUserContext = { id: '1', email: 'test@example.com', name: 'Test User', role: Role.USER, verified: true };
    const userFromDb = {
      id: '1',
      email: 'test@example.com',
      name: 'Test User',
      subscription: { id: 'sub_1', plan: 'premium' },
    };

    mockPrismaService.user.findUnique.mockResolvedValue(userFromDb as any);
    mockStorageService.delete.mockResolvedValue(undefined);
    mockBillingService.cancelSubscription.mockResolvedValue(undefined);
    mockPrismaService.user.delete.mockResolvedValue(userFromDb as any);

    // Act
    const result = await authService.delete(userCtx as any);

    // Assert
    expect(mockBillingService.cancelSubscription).toHaveBeenCalledWith(userFromDb.id);
    expect(result).toEqual(userFromDb);
  });

  it('should throw an error if the user is not found', async () => {
    // Arrange
    const userCtx: MockUserContext = { id: '1', email: 'test@example.com', name: 'Test User', role: Role.USER, verified: true };

    mockPrismaService.user.findUnique.mockResolvedValue(null);

    // Act & Assert
    await expect(authService.delete(userCtx as any)).rejects.toThrow('User not found');
  });

  it('should ignore errors from storage and billing services', async () => {
    // Arrange
    const userCtx: MockUserContext = { id: '1', email: 'test@example.com', name: 'Test User', role: Role.USER, verified: true };
    const userFromDb = {
      id: '1',
      email: 'test@example.com',
      name: 'Test User',
      subscription: null,
    };

    mockPrismaService.user.findUnique.mockResolvedValue(userFromDb as any);
    mockStorageService.delete.mockRejectedValue(new Error('Storage error'));
    mockPrismaService.user.delete.mockResolvedValue(userFromDb as any);

    // Act
    const result = await authService.delete(userCtx as any);

    // Assert
    expect(result).toEqual(userFromDb);
  });
});

// End of unit tests for: delete
