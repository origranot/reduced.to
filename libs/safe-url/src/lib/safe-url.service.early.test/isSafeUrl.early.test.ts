// Unit tests for: isSafeUrl

import { Checker } from '../checkers/checker';

import { SafeUrlService } from '../safe-url.service';

describe('SafeUrlService.isSafeUrl() isSafeUrl method', () => {
  let service: SafeUrlService;
  let mockCheckers: Checker[];

  beforeEach(() => {
    // Create mock checkers
    mockCheckers = [
      {
        isSafeUrl: jest.fn(),
      },
      {
        isSafeUrl: jest.fn(),
      },
    ];

    // Initialize the service with the mock checkers
    service = new SafeUrlService(mockCheckers as any);
  });

  describe('isSafeUrl', () => {
    it('should return true if all checkers return true', async () => {
      // Arrange: Set up the mock checkers to return true
      mockCheckers.forEach((checker) => {
        checker.isSafeUrl = jest.fn().mockResolvedValue(true);
      });

      // Act: Call the method with a sample URL
      const result = await service.isSafeUrl('https://example.com');

      // Assert: Expect the result to be true
      expect(result).toBe(true);
      mockCheckers.forEach((checker) => {
        expect(checker.isSafeUrl).toHaveBeenCalledWith('https://example.com');
      });
    });

    it('should return false if any checker returns false', async () => {
      // Arrange: Set up the mock checkers, one returns false
      mockCheckers[0].isSafeUrl = jest.fn().mockResolvedValue(true);
      mockCheckers[1].isSafeUrl = jest.fn().mockResolvedValue(false);

      // Act: Call the method with a sample URL
      const result = await service.isSafeUrl('https://example.com');

      // Assert: Expect the result to be false
      expect(result).toBe(false);
      expect(mockCheckers[0].isSafeUrl).toHaveBeenCalledWith('https://example.com');
      expect(mockCheckers[1].isSafeUrl).toHaveBeenCalledWith('https://example.com');
    });

    it('should handle an empty URL string', async () => {
      // Arrange: Set up the mock checkers to return true
      mockCheckers.forEach((checker) => {
        checker.isSafeUrl = jest.fn().mockResolvedValue(true);
      });

      // Act: Call the method with an empty URL
      const result = await service.isSafeUrl('');

      // Assert: Expect the result to be true
      expect(result).toBe(true);
      mockCheckers.forEach((checker) => {
        expect(checker.isSafeUrl).toHaveBeenCalledWith('');
      });
    });

    it('should handle a URL with special characters', async () => {
      // Arrange: Set up the mock checkers to return true
      mockCheckers.forEach((checker) => {
        checker.isSafeUrl = jest.fn().mockResolvedValue(true);
      });

      // Act: Call the method with a URL containing special characters
      const result = await service.isSafeUrl('https://example.com/?param=1&other=2');

      // Assert: Expect the result to be true
      expect(result).toBe(true);
      mockCheckers.forEach((checker) => {
        expect(checker.isSafeUrl).toHaveBeenCalledWith('https://example.com/?param=1&other=2');
      });
    });

    it('should handle multiple checkers returning mixed results', async () => {
      // Arrange: Set up the mock checkers with mixed results
      mockCheckers[0].isSafeUrl = jest.fn().mockResolvedValue(true);
      mockCheckers[1].isSafeUrl = jest.fn().mockResolvedValue(true);

      // Act: Call the method with a sample URL
      const result = await service.isSafeUrl('https://example.com');

      // Assert: Expect the result to be true
      expect(result).toBe(true);
      expect(mockCheckers[0].isSafeUrl).toHaveBeenCalledWith('https://example.com');
      expect(mockCheckers[1].isSafeUrl).toHaveBeenCalledWith('https://example.com');
    });

    it('should handle errors thrown by checkers', async () => {
      // Arrange: Set up the mock checkers, one throws an error
      mockCheckers[0].isSafeUrl = jest.fn().mockResolvedValue(true);
      mockCheckers[1].isSafeUrl = jest.fn().mockRejectedValue(new Error('Checker error'));

      // Act: Call the method with a sample URL
      await expect(service.isSafeUrl('https://example.com')).rejects.toThrow('Checker error');
      expect(mockCheckers[0].isSafeUrl).toHaveBeenCalledWith('https://example.com');
      expect(mockCheckers[1].isSafeUrl).toHaveBeenCalledWith('https://example.com');
    });
  });
});

// End of unit tests for: isSafeUrl
