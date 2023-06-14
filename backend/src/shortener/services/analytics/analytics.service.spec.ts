import { Test, TestingModule } from '@nestjs/testing';
import { AnalyticsService } from './analytics.service';
import { Request } from 'express';
import { AppConfigModule } from '../../../config/config.module';
import { MemphisModule } from '../../../memphis/memphis.module';

describe('AnalyticsService', () => {
  let service: AnalyticsService;
  let serviceSpy: jest.SpyInstance;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppConfigModule, MemphisModule],
      providers: [AnalyticsService],
    }).compile();

    service = module.get<AnalyticsService>(AnalyticsService);

    // Spy on the private method
    serviceSpy = jest.spyOn(service as any, 'produce');
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

      expect(serviceSpy).toHaveBeenCalledWith({
        request,
        shortenedUrl,
      });
    });
  });
});
