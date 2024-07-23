// Unit tests for: findOne

import { BadRequestException, UnauthorizedException } from '@nestjs/common';

import { Request } from 'express';

import { IClientDetails } from '../../shared/decorators/client-details/client-details.decorator';

import { addUtmParams } from '@reduced.to/utils';

import { ShortenerController } from '../shortener.controller';

class MockAppConfigService {
  public getConfig = jest.fn().mockReturnValue({ safeUrl: { enable: false } });
}

class MockAppLoggerService {
  public error = jest.fn();
  public log = jest.fn();
}

class MockShortenerService {
  public getLink = jest.fn();
  public verifyPassword = jest.fn();
  public publish = jest.fn();
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

describe('ShortenerController.findOne() findOne method', () => {
  let controller: ShortenerController;
  let mockShortenerService: MockShortenerService;
  let mockShortenerProducer: MockShortenerProducer;
  let mockLogger: MockAppLoggerService;

  beforeEach(() => {
    mockShortenerService = new MockShortenerService();
    mockShortenerProducer = new MockShortenerProducer();
    mockLogger = new MockAppLoggerService();
    const mockConfigService = new MockAppConfigService();
    const mockSafeUrlService = new MockSafeUrlService();
    const mockUsageService = new MockUsageService();

    controller = new ShortenerController(
      mockConfigService as any,
      mockLogger as any,
      mockShortenerService as any,
      mockShortenerProducer as any,
      mockSafeUrlService as any,
      mockUsageService as any
    );
  });

  describe('Happy Path', () => {
    it('should return a valid link response when a valid key is provided', async () => {
      const mockLinkData = { key: 'abc123', url: 'http://example.com', password: null, utm: {} };
      const clientDetails: IClientDetails = { ip: '127.0.0.1', userAgent: 'test-agent' };
      const req = { headers: { referer: 'http://referer.com' } } as Request;

      mockShortenerService.getLink.mockResolvedValue(mockLinkData as any);
      mockShortenerProducer.publish.mockResolvedValue(undefined);

      const result = await controller.findOne(clientDetails, 'abc123', '', req);

      expect(result).toEqual({
        url: addUtmParams(mockLinkData.url, mockLinkData.utm),
        key: mockLinkData.key,
      });
      expect(mockShortenerService.getLink).toHaveBeenCalledWith('abc123');
      expect(mockShortenerProducer.publish).toHaveBeenCalledWith({
        ...clientDetails,
        referer: req.headers.referer,
        key: mockLinkData.key,
        url: mockLinkData.url,
      });
    });
  });

  describe('Edge Cases', () => {
    it('should throw BadRequestException if the link does not exist', async () => {
      const clientDetails: IClientDetails = { ip: '127.0.0.1', userAgent: 'test-agent' };
      const req = { headers: { referer: 'http://referer.com' } } as Request;

      mockShortenerService.getLink.mockResolvedValue(null);

      await expect(controller.findOne(clientDetails, 'invalidKey', '', req)).rejects.toThrow(BadRequestException);
      expect(mockShortenerService.getLink).toHaveBeenCalledWith('invalidKey');
    });

    it('should throw UnauthorizedException if the password is incorrect', async () => {
      const mockLinkData = { key: 'abc123', url: 'http://example.com', password: 'secret', utm: {} };
      const clientDetails: IClientDetails = { ip: '127.0.0.1', userAgent: 'test-agent' };
      const req = { headers: { referer: 'http://referer.com' } } as Request;

      mockShortenerService.getLink.mockResolvedValue(mockLinkData as any);
      mockShortenerService.verifyPassword.mockResolvedValue(false);

      await expect(controller.findOne(clientDetails, 'abc123', 'wrongPassword', req)).rejects.toThrow(UnauthorizedException);
      expect(mockShortenerService.getLink).toHaveBeenCalledWith('abc123');
      expect(mockShortenerService.verifyPassword).toHaveBeenCalledWith(mockLinkData.password, 'wrongPassword');
    });

    it('should log an error if publishing fails', async () => {
      const mockLinkData = { key: 'abc123', url: 'http://example.com', password: null, utm: {} };
      const clientDetails: IClientDetails = { ip: '127.0.0.1', userAgent: 'test-agent' };
      const req = { headers: { referer: 'http://referer.com' } } as Request;

      mockShortenerService.getLink.mockResolvedValue(mockLinkData as any);
      mockShortenerProducer.publish.mockRejectedValue(new Error('Publish error'));

      await controller.findOne(clientDetails, 'abc123', '', req);

      expect(mockLogger.error).toHaveBeenCalledWith('Error while publishing shortened url: Publish error');
    });
  });
});

// End of unit tests for: findOne
