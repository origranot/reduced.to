// Unit tests for: random

import { ShortenerController } from '../shortener.controller';

class MockAppConfigService {
  public getConfig = jest.fn().mockReturnValue({ safeUrl: { enable: false } });
}

class MockAppLoggerService {
  public log = jest.fn();
  public error = jest.fn();
}

class MockShortenerService {
  public createRandomShortenedUrl = jest.fn();
}

class MockShortenerProducer {
  public publish = jest.fn();
}

class MockSafeUrlService {
  public isSafeUrl = jest.fn();
}

class MockUsageService {
  public isEligibleToCreateLink = jest.fn();
}

describe('ShortenerController.random() random method', () => {
  let controller: ShortenerController;
  let mockShortenerService: MockShortenerService;
  let mockLoggerService: MockAppLoggerService;
  let mockShortenerProducer: MockShortenerProducer;
  let mockSafeUrlService: MockSafeUrlService;
  let mockUsageService: MockUsageService;
  let mockConfigService: MockAppConfigService;

  beforeEach(() => {
    mockShortenerService = new MockShortenerService();
    mockLoggerService = new MockAppLoggerService();
    mockShortenerProducer = new MockShortenerProducer();
    mockSafeUrlService = new MockSafeUrlService();
    mockUsageService = new MockUsageService();
    mockConfigService = new MockAppConfigService();

    controller = new ShortenerController(
      mockConfigService as any,
      mockLoggerService as any,
      mockShortenerService as any,
      mockShortenerProducer as any,
      mockSafeUrlService as any,
      mockUsageService as any
    );
  });

  describe('random', () => {
    it('should return a random shortened URL', async () => {
      // Arrange
      const expectedUrl = 'http://short.url/random';
      mockShortenerService.createRandomShortenedUrl.mockResolvedValue(expectedUrl as any);

      // Act
      const result = await controller.random();

      // Assert
      expect(result).toBe(expectedUrl);
      expect(mockShortenerService.createRandomShortenedUrl).toHaveBeenCalled();
    });

    it('should handle errors when creating a random shortened URL', async () => {
      // Arrange
      const errorMessage = 'Error creating random URL';
      mockShortenerService.createRandomShortenedUrl.mockRejectedValue(new Error(errorMessage));

      // Act & Assert
      await expect(controller.random()).rejects.toThrowError(new Error(errorMessage));
      expect(mockShortenerService.createRandomShortenedUrl).toHaveBeenCalled();
    });
  });
});

// End of unit tests for: random
