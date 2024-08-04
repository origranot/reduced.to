// Unit tests for: shortener

import { BadRequestException } from '@nestjs/common';

import { ShortenerDto } from '../dto';

import { Request } from 'express';

import { ShortenerController } from '../shortener.controller';

class MockAppConfigService {
  public getConfig = jest.fn().mockReturnValue({ safeUrl: { enable: true } });
}

class MockAppLoggerService {
  public log = jest.fn();
  public error = jest.fn();
}

class MockShortenerService {
  public isKeyAvailable = jest.fn();
  public createUsersShortenedUrl = jest.fn();
  public createShortenedUrl = jest.fn();
  public hashPassword = jest.fn();
  public isEligibleToCreateLink = jest.fn();
  public createRandomShortenedUrl = jest.fn();
  public getLink = jest.fn();
  public verifyPassword = jest.fn();
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

describe('ShortenerController.shortener() shortener method', () => {
  let controller: ShortenerController;
  let mockConfigService: MockAppConfigService;
  let mockLoggerService: MockAppLoggerService;
  let mockShortenerService: MockShortenerService;
  let mockShortenerProducer: MockShortenerProducer;
  let mockSafeUrlService: MockSafeUrlService;
  let mockUsageService: MockUsageService;

  beforeEach(() => {
    mockConfigService = new MockAppConfigService();
    mockLoggerService = new MockAppLoggerService();
    mockShortenerService = new MockShortenerService();
    mockShortenerProducer = new MockShortenerProducer();
    mockSafeUrlService = new MockSafeUrlService();
    mockUsageService = new MockUsageService();

    controller = new ShortenerController(
      mockConfigService as any,
      mockLoggerService as any,
      mockShortenerService as any,
      mockShortenerProducer as any,
      mockSafeUrlService as any,
      mockUsageService as any
    );
  });

  describe('shortener - Happy Path', () => {
    it('should create a shortened URL for a verified user', async () => {
      const req = { user: { id: 'userId', verified: true } } as Request;
      const shortenerDto: ShortenerDto = { url: 'http://example.com' } as ShortenerDto;

      mockShortenerService.isEligibleToCreateLink.mockResolvedValue(true);
      mockShortenerService.createUsersShortenedUrl.mockResolvedValue({ key: 'shortKey' });

      const result = await controller.shortener(shortenerDto, req);

      expect(result).toEqual({ key: 'shortKey' });
      expect(mockShortenerService.createUsersShortenedUrl).toHaveBeenCalledWith(req.user, shortenerDto);
    });

    it('should create a temporary shortened URL without a password', async () => {
      const req = { user: { id: 'userId', verified: true } } as Request;
      const shortenerDto: ShortenerDto = { url: 'http://example.com', temporary: true } as ShortenerDto;

      mockShortenerService.createShortenedUrl.mockResolvedValue({ key: 'tempKey' });

      const result = await controller.shortener(shortenerDto, req);

      expect(result).toEqual({ key: 'tempKey' });
      expect(mockShortenerService.createShortenedUrl).toHaveBeenCalledWith(shortenerDto);
    });
  });

  describe('shortener - Edge Cases', () => {
    it('should throw BadRequestException if the URL is not safe', async () => {
      const req = { user: { id: 'userId', verified: true } } as Request;
      const shortenerDto: ShortenerDto = { url: 'http://malicious.com' } as ShortenerDto;

      mockSafeUrlService.isSafeUrl.mockResolvedValue(false);

      await expect(controller.shortener(shortenerDto, req)).rejects.toThrow(BadRequestException);
      expect(mockSafeUrlService.isSafeUrl).toHaveBeenCalledWith(shortenerDto.url);
    });

    it('should throw BadRequestException if the user is not verified', async () => {
      const req = { user: { id: 'userId', verified: false } } as Request;
      const shortenerDto: ShortenerDto = { url: 'http://example.com' } as ShortenerDto;

      await expect(controller.shortener(shortenerDto, req)).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if the user has reached their link creation limit', async () => {
      const req = { user: { id: 'userId', verified: true } } as Request;
      const shortenerDto: ShortenerDto = { url: 'http://example.com' } as ShortenerDto;

      mockUsageService.isEligibleToCreateLink.mockResolvedValue(false);

      await expect(controller.shortener(shortenerDto, req)).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if the key is not available', async () => {
      const req = { user: { id: 'userId', verified: true } } as Request;
      const shortenerDto: ShortenerDto = { url: 'http://example.com', key: 'existingKey' } as ShortenerDto;

      mockShortenerService.isKeyAvailable.mockResolvedValue(false);

      await expect(controller.shortener(shortenerDto, req)).rejects.toThrow(BadRequestException);
    });

    it('should hash the password if it exists', async () => {
      const req = { user: { id: 'userId', verified: true } } as Request;
      const shortenerDto: ShortenerDto = { url: 'http://example.com', password: 'password123' } as ShortenerDto;

      mockShortenerService.isEligibleToCreateLink.mockResolvedValue(true);
      mockShortenerService.hashPassword.mockResolvedValue('hashedPassword');
      mockShortenerService.createUsersShortenedUrl.mockResolvedValue({ key: 'shortKey' });

      await controller.shortener(shortenerDto, req);

      expect(mockShortenerService.hashPassword).toHaveBeenCalledWith(shortenerDto.password);
    });
  });
});

// End of unit tests for: shortener
