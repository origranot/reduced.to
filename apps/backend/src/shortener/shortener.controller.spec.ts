import { AppConfigModule, AppConfigService } from '@reduced.to/config';
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
import { SafeUrlService } from '@reduced.to/safe-url';
import { UsageService } from '@reduced.to/subscription-manager';

describe('ShortenerController', () => {
  let shortenerController: ShortenerController;
  let shortenerService: ShortenerService;
  let safeUrlService: SafeUrlService;
  let configService: AppConfigService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppConfigModule, AppLoggerModule, AppCacheModule, QueueManagerModule],
      controllers: [ShortenerController],
      providers: [
        {
          provide: ShortenerService,
          useValue: {
            createUsersShortenedUrl: jest.fn(),
            createShortenedUrl: jest.fn(),
            getLink: jest.fn(),
            verifyPassword: jest.fn(),
            isKeyAvailable: jest.fn(),
          },
        },
        {
          provide: SafeUrlService,
          useValue: {
            isSafeUrl: jest.fn().mockResolvedValue(true),
          },
        },
        {
          provide: UsageService,
          useValue: {
            isEligibleToCreateLink: jest.fn().mockResolvedValue(true),
          },
        },
        QueueManagerService,
        ShortenerProducer,
      ],
    }).compile();

    shortenerService = moduleRef.get<ShortenerService>(ShortenerService);
    shortenerController = moduleRef.get<ShortenerController>(ShortenerController);
    safeUrlService = moduleRef.get<SafeUrlService>(SafeUrlService);
    configService = moduleRef.get<AppConfigService>(AppConfigService);
  });

  it('should be defined', () => {
    expect(shortenerController).toBeDefined();
  });

  describe('shortener', () => {
    it('should return null when createUsersShortUrl return null in case of an authenticated and verified user', async () => {
      jest.spyOn(shortenerService, 'createUsersShortenedUrl').mockReturnValue(null);
      jest.spyOn(shortenerService, 'createShortenedUrl').mockResolvedValue({ key: 'url' });

      const body: ShortenerDto = { url: 'https://github.com/origranot/reduced.to' };
      const req = { user: { verified: true } } as unknown as Request;
      const short = await shortenerController.shortener(body, req);
      expect(short).toBeNull();
    });

    it('should return a shortened url when createUsersShortUrl return it in case of an authenticated and verified user', async () => {
      jest.spyOn(shortenerService, 'createUsersShortenedUrl').mockResolvedValue({ key: 'url.com' });
      jest.spyOn(shortenerService, 'createShortenedUrl').mockResolvedValue(null);

      const body: ShortenerDto = { url: 'https://github.com/origranot/reduced.to' };
      const req = { user: { verified: true } } as unknown as Request;
      const short = await shortenerController.shortener(body, req);
      expect(short).toStrictEqual({ key: 'url.com' });
    });

    it('should return null when createShortenedUrl return null in case of temporary link', async () => {
      jest.spyOn(shortenerService, 'createUsersShortenedUrl').mockResolvedValue({ key: 'url.com' });
      jest.spyOn(shortenerService, 'createShortenedUrl').mockResolvedValue(null);

      const body: ShortenerDto = { url: 'https://github.com/origranot/reduced.to', temporary: true };
      const req = {} as Request;
      const short = await shortenerController.shortener(body, req);
      expect(short).toBeNull();
    });

    it('should return a shortened url when createShortenedUrl return it in case of temporary link', async () => {
      jest.spyOn(shortenerService, 'createUsersShortenedUrl').mockResolvedValue(null);
      jest.spyOn(shortenerService, 'createShortenedUrl').mockResolvedValue({ key: 'url.com' });

      const body: ShortenerDto = { url: 'https://github.com/origranot/reduced.to', temporary: true };
      const req = {} as Request;
      const short = await shortenerController.shortener(body, req);
      expect(short).toStrictEqual({ key: 'url.com' });
    });

    it('shoud not check for safe url if safeUrl is set to false', async () => {
      jest.spyOn(configService, 'getConfig').mockReturnValue({ safeUrl: { enable: false } } as any);
      const spy = jest.spyOn(safeUrlService, 'isSafeUrl').mockResolvedValue(false);

      const body: ShortenerDto = { url: 'http://malicious-site.com' };
      const req = { user: { verified: true } } as unknown as Request;

      await shortenerController.shortener(body, req);
      expect(spy).toHaveBeenCalledTimes(0);
    });

    it('should throw an error when the URL is not safe', async () => {
      jest.spyOn(safeUrlService, 'isSafeUrl').mockResolvedValue(false);
      jest.spyOn(configService, 'getConfig').mockReturnValue({ safeUrl: { enable: true } } as any);

      const body: ShortenerDto = { url: 'http://malicious-site.com' };
      const req = { user: { verified: true } } as unknown as Request;

      await expect(shortenerController.shortener(body, req)).rejects.toThrow('This url is not safe to shorten!');
    });

    it('should not allow temporary links to be password protected', async () => {
      const KEY = 'url.com';
      const spy = jest.spyOn(shortenerService, 'createShortenedUrl').mockResolvedValue({ key: KEY });

      const body: ShortenerDto = { url: 'https://github.com/origranot/reduced.to', temporary: true, password: 'secret' };
      const req = {} as Request;

      const { password, ...rest } = body;

      const short = await shortenerController.shortener(body, req);

      // Make sure the password is removed from the body before calling the service
      expect(spy).toHaveBeenCalledWith(rest);
      expect(short).toStrictEqual({ key: KEY });
    });

    it('should throw an error if the key is already in use', async () => {
      jest.spyOn(shortenerService, 'createShortenedUrl').mockResolvedValue({ key: 'url.com' });
      jest.spyOn(shortenerService, 'isKeyAvailable').mockResolvedValue(false);

      const body: ShortenerDto = { url: 'https://github.com/origranot/reduced.to', key: 'taken' };
      const req = {} as Request;

      await expect(shortenerController.shortener(body, req)).rejects.toThrow('This short link already exists');
    });
  });

  describe('findOne', () => {
    it('should return the original URL when given a valid key', async () => {
      jest.spyOn(shortenerService, 'getLink').mockResolvedValue({ url: 'https://github.com/origranot/reduced.to', key: 'best' });
      const key = 'best';
      const clientDetails: IClientDetails = {
        ip: '1.2.3.4',
        userAgent: 'test',
      };

      const link = await shortenerController.findOne(clientDetails, key, '', {} as Request);
      expect(link).toStrictEqual({ url: 'https://github.com/origranot/reduced.to', key: 'best' });
    });

    it('should return an error if the short URL is not found in the database', async () => {
      jest.spyOn(shortenerService, 'getLink').mockResolvedValue(null);
      const key = 'not-found';
      const clientDetails: IClientDetails = {
        ip: '1.2.3.4',
        userAgent: 'test',
      };

      try {
        await shortenerController.findOne(clientDetails, key, '', {} as Request);
        throw new Error('Expected an error to be thrown!');
      } catch (err) {
        expect(err.message).toBe('Shortened url is wrong or expired');
      }
    });

    it('should return the original URL when given a valid key and correct password', async () => {
      jest
        .spyOn(shortenerService, 'getLink')
        .mockResolvedValue({ url: 'https://github.com/origranot/reduced.to', key: 'best', password: 'correct-password' });
      jest.spyOn(shortenerService, 'verifyPassword').mockResolvedValue(true);
      const key = 'best';
      const clientDetails: IClientDetails = {
        ip: '1.2.3.4',
        userAgent: 'test',
      };

      const link = await shortenerController.findOne(clientDetails, key, 'correct-password', {} as Request);
      expect(link).toStrictEqual({ url: 'https://github.com/origranot/reduced.to', key: 'best' });
    });

    it('should throw an error if the password is incorrect / missing', async () => {
      jest
        .spyOn(shortenerService, 'getLink')
        .mockResolvedValue({ url: 'https://github.com/origranot/reduced.to', key: 'best', password: 'correct-password' });
      jest.spyOn(shortenerService, 'verifyPassword').mockResolvedValue(false);
      const key = 'best';
      const clientDetails: IClientDetails = {
        ip: '1.2.3.4',
        userAgent: 'test',
      };

      await expect(shortenerController.findOne(clientDetails, key, 'wrong-password', {} as Request)).rejects.toThrow(
        'Incorrect password for this url!'
      );
    });
  });
});
