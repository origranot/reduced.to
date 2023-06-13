import { Test, TestingModule } from '@nestjs/testing';
import { AnalyticsService } from './analytics.service';
import { Request } from 'express';
import { AnalyticsProducer } from './analytics.producer';
import { AppConfigModule } from '../../config/config.module';
import { AnalyticsModule } from './analytics.module';

describe('AnalyticsService', () => {
  let service: AnalyticsService;
  let analyticsProducer: AnalyticsProducer;
  let producerSpy: jest.SpyInstance;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppConfigModule, AnalyticsModule],
    }).compile();

    service = module.get<AnalyticsService>(AnalyticsService);
    analyticsProducer = module.get<AnalyticsProducer>(AnalyticsProducer);

    producerSpy = jest.spyOn(analyticsProducer, 'produce');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('trackRequest', () => {
    it('should call the producer with the correct message', async () => {
      const request: Partial<Request> = {
        headers: {
          'user-agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36',
          'x-forwarded-for': '192.168.1.1',
          host: 'example.com',
          referer: 'https://google.com',
          'accept-language': 'en-US,en;q=0.9',
        },
        socket: {
          remoteAddress: '192.168.1.2',
        } as any,
      };
      const shortenedUrl = 'abc123';

      await service.trackRequest(request as Request, shortenedUrl);

      // Assert
      expect(producerSpy).toHaveBeenCalledWith({
        stationName: 'analytics',
        producerName: 'requestTracker',
        message: {
          request,
          shortenedUrl,
        },
      });
    });
  });
});
