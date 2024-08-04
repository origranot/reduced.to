// Unit tests for: set

import { AppCacheService, LinkValue } from '../cache.service';

// Mock Cache type
type MockCache = {
  set: jest.Mock;
  get: jest.Mock;
  del: jest.Mock;
};

// Initialize the mock cache
const mockCache: MockCache = {
  set: jest.fn(),
  get: jest.fn(),
  del: jest.fn(),
};

describe('AppCacheService.set() set method', () => {
  let appCacheService: AppCacheService;

  beforeEach(() => {
    appCacheService = new AppCacheService(mockCache as any);
  });

  // Happy Path Tests
  describe('Happy Path', () => {
    it('should successfully set a value in the cache', async () => {
      // Arrange
      const key = 'testKey';
      const value: LinkValue = { url: 'http://example.com', key: 'testKey' };
      const ttl = 3600; // 1 hour

      // Act
      await appCacheService.set(key, value, ttl);

      // Assert
      expect(mockCache.set).toHaveBeenCalledWith(key, value, ttl);
    });

    it('should set a value in the cache without TTL', async () => {
      // Arrange
      const key = 'testKey';
      const value: LinkValue = { url: 'http://example.com', key: 'testKey' };

      // Act
      await appCacheService.set(key, value);

      // Assert
      expect(mockCache.set).toHaveBeenCalledWith(key, value, undefined);
    });
  });

  // Edge Cases Tests
  describe('Edge Cases', () => {
    it('should handle setting a value with a negative TTL gracefully', async () => {
      // Arrange
      const key = 'testKey';
      const value: LinkValue = { url: 'http://example.com', key: 'testKey' };
      const ttl = -1; // Negative TTL

      // Act
      await appCacheService.set(key, value, ttl);

      // Assert
      expect(mockCache.set).not.toHaveBeenCalled();
    });

    it('should handle setting a value with undefined key gracefully', async () => {
      // Arrange
      const value: LinkValue = { url: 'http://example.com', key: 'testKey' };
      const key = undefined; // Undefined key

      // Act
      await appCacheService.set(key as any, value);

      // Assert
      expect(mockCache.set).toHaveBeenCalledWith(undefined, value, undefined);
    });

    it('should handle setting a value with undefined value gracefully', async () => {
      // Arrange
      const key = 'testKey';
      const value = undefined; // Undefined value

      // Act
      await appCacheService.set(key, value as any);

      // Assert
      expect(mockCache.set).toHaveBeenCalledWith(key, undefined, undefined);
    });

    it('should handle setting a value with a large TTL', async () => {
      // Arrange
      const key = 'testKey';
      const value: LinkValue = { url: 'http://example.com', key: 'testKey' };
      const ttl = Number.MAX_SAFE_INTEGER; // Large TTL

      // Act
      await appCacheService.set(key, value, ttl);

      // Assert
      expect(mockCache.set).toHaveBeenCalledWith(key, value, ttl);
    });
  });
});

// End of unit tests for: set
