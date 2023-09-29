import { AppConfigModule } from '@reduced.to/config';
import { AppCacheModule } from '../cache/cache.module';
import { ShortenerService } from './shortener.service';
import { ShortenerController } from './shortener.controller';
import { Test } from '@nestjs/testing';
import { ShortenerDto } from './dto';
import { Request } from 'express';
import { AppLoggerModule } from '@reduced.to/logger';
import { ShortenerProducer } from './producer/shortener.producer';
import { QueueManagerModule, QueueManagerService } from '@reduced.to/queue-manager';
import { IClientDetails } from '../shared/decorators/client-details/client-details.decorator';

describe('ShortenerController', () => {
  let shortenerController: ShortenerController;
  let shortenerService: ShortenerService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppConfigModule, AppLoggerModule, AppCacheModule, QueueManagerModule],
      controllers: [ShortenerController],
      providers: [
        {
          provide: ShortenerService,
          useValue: {
            getOriginalUrl: jest.fn(),
            createUsersShortenedUrl: jest.fn(),
            createShortenedUrl: jest.fn(),
          },
        },
        QueueManagerService,
        ShortenerProducer,
      ],
    }).compile();

    shortenerService = moduleRef.get<ShortenerService>(ShortenerService);
    shortenerController = moduleRef.get<ShortenerController>(ShortenerController);
  });

  it('should be defined', () => {
    expect(shortenerController).toBeDefined();
  });

  describe('shortener', () => {
    it('should return null when createUsersShortUrl return null in case of an authenticated and verified user', async () => {
      jest.spyOn(shortenerService, 'createUsersShortenedUrl').mockReturnValue(null);
      jest.spyOn(shortenerService, 'createShortenedUrl').mockResolvedValue({ newUrl: 'url' });

      const body: ShortenerDto = { originalUrl: 'https://github.com/origranot/reduced.to' };
      const req = { user: { verified: true } } as unknown as Request;
      const short = await shortenerController.shortener(body, req);
      expect(short).toBeNull();
    });

    it('should return a shortened url when createUsersShortUrl return it in case of an authenticated and verified user', async () => {
      jest.spyOn(shortenerService, 'createUsersShortenedUrl').mockResolvedValue({ newUrl: 'url.com' });
      jest.spyOn(shortenerService, 'createShortenedUrl').mockResolvedValue(null);

      const body: ShortenerDto = { originalUrl: 'https://github.com/origranot/reduced.to' };
      const req = { user: { verified: true } } as unknown as Request;
      const short = await shortenerController.shortener(body, req);
      expect(short).toStrictEqual({ newUrl: 'url.com' });
    });

    it('should return null when createShortenedUrl return null in case of guest user', async () => {
      jest.spyOn(shortenerService, 'createUsersShortenedUrl').mockResolvedValue({ newUrl: 'url.com' });
      jest.spyOn(shortenerService, 'createShortenedUrl').mockResolvedValue(null);

      const body: ShortenerDto = { originalUrl: 'https://github.com/origranot/reduced.to' };
      const req = {} as Request;
      const short = await shortenerController.shortener(body, req);
      expect(short).toBeNull();
    });

    it('should return a shortened url when createShortenedUrl return it in case of guest user', async () => {
      jest.spyOn(shortenerService, 'createUsersShortenedUrl').mockResolvedValue(null);
      jest.spyOn(shortenerService, 'createShortenedUrl').mockResolvedValue({ newUrl: 'url.com' });

      const body: ShortenerDto = { originalUrl: 'https://github.com/origranot/reduced.to' };
      const req = {} as Request;
      const short = await shortenerController.shortener(body, req);
      expect(short).toStrictEqual({ newUrl: 'url.com' });
    });
  });

  describe('findOne', () => {
    it('should return the original URL when given a valid short URL', async () => {
      jest.spyOn(shortenerService, 'getOriginalUrl').mockResolvedValue('https://github.com/origranot/reduced.to');
      const shortUrl = 'best';
      const clientDetails: IClientDetails = {
        ip: '1.2.3.4',
        userAgent: 'test',
      };

      const originalUrl = await shortenerController.findOne(clientDetails, shortUrl);
      expect(originalUrl).toBe('https://github.com/origranot/reduced.to');
    });

    it('should return an error if the short URL is not found in the database', async () => {
      jest.spyOn(shortenerService, 'getOriginalUrl').mockResolvedValue(null);
      const shortUrl = 'not-found';
      const clientDetails: IClientDetails = {
        ip: '1.2.3.4',
        userAgent: 'test',
      };

      try {
        await shortenerController.findOne(clientDetails, shortUrl);
        throw new Error('Expected an error to be thrown!');
      } catch (err) {
        expect(err.message).toBe('Shortened url is wrong or expired');
      }
    });
  });
});
