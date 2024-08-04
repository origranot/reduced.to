// Unit tests for: del

import { AppCacheService } from '../cache.service';

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

describe('AppCacheService.del() del method', () => {
  let appCacheService: AppCacheService;

  beforeEach(() => {
    appCacheService = new AppCacheService(mockCache as any);
  });

  describe('del method', () => {
    it('should delete the cache entry successfully', async () => {
      // This test checks the happy path where the cache entry is deleted successfully.
      const key = 'testKey';
      mockCache.del.mockResolvedValue(undefined); // Simulate successful deletion

      await appCacheService.del(key);

      expect(mockCache.del).toHaveBeenCalledWith(key);
      expect(mockCache.del).toHaveBeenCalledTimes(1);
    });

    it('should handle deletion of a non-existing cache entry gracefully', async () => {
      // This test checks the edge case where the cache entry does not exist.
      const key = 'nonExistingKey';
      mockCache.del.mockResolvedValue(undefined); // Simulate no error on deletion

      await appCacheService.del(key);

      expect(mockCache.del).toHaveBeenCalledWith(key);
      expect(mockCache.del).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if cache deletion fails', async () => {
      // This test checks the edge case where the deletion fails.
      const key = 'testKey';
      const errorMessage = 'Cache deletion failed';
      mockCache.del.mockRejectedValue(new Error(errorMessage)); // Simulate deletion failure

      await expect(appCacheService.del(key)).rejects.toThrow(errorMessage);
      expect(mockCache.del).toHaveBeenCalledWith(key);
      expect(mockCache.del).toHaveBeenCalledTimes(1);
    });
  });
});

// End of unit tests for: del
