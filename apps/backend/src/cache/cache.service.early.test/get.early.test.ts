// Unit tests for: get

import { AppCacheService, LinkValue } from '../cache.service';

// Mock Cache type
type MockCache = {
  get: jest.Mock;
  set: jest.Mock;
  del: jest.Mock;
};

// Initialize the mock cache
const mockCache: MockCache = {
  get: jest.fn(),
  set: jest.fn(),
  del: jest.fn(),
};

describe('AppCacheService.get() get method', () => {
  let appCacheService: AppCacheService;

  beforeEach(() => {
    appCacheService = new AppCacheService(mockCache as any);
  });

  // Happy path tests
  describe('Happy Path', () => {
    it('should return a LinkValue when a valid key is provided', async () => {
      // Arrange
      const key = 'validKey';
      const expectedValue: LinkValue = { url: 'http://example.com', key: 'validKey' };
      mockCache.get.mockResolvedValue(expectedValue as any);

      // Act
      const result = await appCacheService.get(key);

      // Assert
      expect(result).toEqual(expectedValue);
      expect(mockCache.get).toHaveBeenCalledWith(key);
    });

    it('should return null when the key does not exist', async () => {
      // Arrange
      const key = 'nonExistentKey';
      mockCache.get.mockResolvedValue(null as any);

      // Act
      const result = await appCacheService.get(key);

      // Assert
      expect(result).toBeNull();
      expect(mockCache.get).toHaveBeenCalledWith(key);
    });
  });

  // Edge case tests
  describe('Edge Cases', () => {
    it('should handle when the cache returns undefined', async () => {
      // Arrange
      const key = 'undefinedKey';
      mockCache.get.mockResolvedValue(undefined as any);

      // Act
      const result = await appCacheService.get(key);

      // Assert
      expect(result).toBeUndefined();
      expect(mockCache.get).toHaveBeenCalledWith(key);
    });

    it('should handle errors thrown by the cache', async () => {
      // Arrange
      const key = 'errorKey';
      const errorMessage = 'Cache error';
      mockCache.get.mockRejectedValue(new Error(errorMessage) as never);

      // Act & Assert
      await expect(appCacheService.get(key)).rejects.toThrow(errorMessage);
      expect(mockCache.get).toHaveBeenCalledWith(key);
    });

    it('should handle empty string as a key', async () => {
      // Arrange
      const key = '';
      const expectedValue: LinkValue = { url: 'http://example.com', key: '' };
      mockCache.get.mockResolvedValue(expectedValue as any);

      // Act
      const result = await appCacheService.get(key);

      // Assert
      expect(result).toEqual(expectedValue);
      expect(mockCache.get).toHaveBeenCalledWith(key);
    });

    it('should handle special characters in the key', async () => {
      // Arrange
      const key = 'key_with_special_chars!@#';
      const expectedValue: LinkValue = { url: 'http://example.com', key: key };
      mockCache.get.mockResolvedValue(expectedValue as any);

      // Act
      const result = await appCacheService.get(key);

      // Assert
      expect(result).toEqual(expectedValue);
      expect(mockCache.get).toHaveBeenCalledWith(key);
    });
  });
});

// End of unit tests for: get
