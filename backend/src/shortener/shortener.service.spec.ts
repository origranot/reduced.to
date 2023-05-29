import { AppConfigService } from '../config/config.service';
import { ShortenerService } from './shortener.service';
import { Test, TestingModule } from '@nestjs/testing';
import { AppCacheModule } from '../cache/cache.module';
import { AppCacheService } from '../cache/cache.service';
import { AppConfigModule } from '../config/config.module';
import { PrismaService } from '../prisma/prisma.service';
import { ShortenerDto } from './dto';
import { BadRequestException } from '@nestjs/common';
import { UserContext } from '../auth/interfaces/user-context';

describe('ShortenerService', () => {
  let service: ShortenerService;
  let config: AppConfigService;
  let cache: AppCacheService;
  let prisma: PrismaService;

  const ORIGINAL_URL = 'https://github.com/origranot/reduced.to';
  const USER_ID = '26419f47-97bd-4f28-ba2d-a33c224fa4af';
  const SHORT_URL = 'best_url_shortener';
  const URL_DB_DATA = {
    id: USER_ID,
    shortenedUrl: 'sqpjf',
    originalUrl: ORIGINAL_URL,
    userId: USER_ID,
    description: null,
    expirationTime: null,
    createdAt: '2023-05-28T15:16:06.837Z' as any,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppConfigModule, AppCacheModule],
      providers: [
        ShortenerService,
        {
          provide: PrismaService,
          useFactory: () => ({
            url: {
              create: jest.fn().mockResolvedValue(URL_DB_DATA),
              findFirst: jest.fn(),
            },
          }),
        },
      ],
    }).compile();

    cache = module.get<AppCacheService>(AppCacheService);
    config = module.get<AppConfigService>(AppConfigService);
    service = module.get<ShortenerService>(ShortenerService);
    prisma = module.get<PrismaService>(PrismaService);

    await cache.getCacheManager.reset();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getUrlFromCache', () => {
    it('should add url to cache store', async () => {
      await service.addUrl(ORIGINAL_URL, SHORT_URL);

      const keys = await cache.getCacheManager.store.keys();
      expect(keys).toHaveLength(1);

      const originalUrl = await service.getUrlFromCache(SHORT_URL);
      expect(originalUrl).toBe(ORIGINAL_URL);
    });

    it('should return null if short url not found in cache', async () => {
      const originalUrl = await service.getUrlFromCache(SHORT_URL);
      expect(originalUrl).toBeNull();
    });
  });

  describe('generateShortenedUrl', () => {
    it('should generate a short url with 5 random characters', () => {
      const shortUrl = service.generateShortenedUrl();
      expect(shortUrl).toHaveLength(5);
    });

    it('should generate a short url with only alphanumeric characters', () => {
      const shortUrl = service.generateShortenedUrl();
      expect(shortUrl).toMatch(/^[a-z0-9]+$/i);
    });
  });

  describe('isShortUrlAvailable', () => {
    it('should return true because short url is available', async () => {
      const isAvailable = await service.isShortenedUrlAvailable(SHORT_URL);
      expect(isAvailable).toBeTruthy();
    });

    it('should return false because short url is taken', async () => {
      await service.addUrl(ORIGINAL_URL, SHORT_URL);
      const isAvailable = await service.isShortenedUrlAvailable(SHORT_URL);
      expect(isAvailable).toBeFalsy();
    });
  });

  it('should throw an error if short url is already taken', async () => {
    const originalUrl = ORIGINAL_URL;
    const shortUrl = 'best_url_shortener';

    await service.addUrl(originalUrl, shortUrl);
    await expect(async () => {
      await service.addUrl(originalUrl, shortUrl);
    }).rejects.toThrowError('Shortened URL already taken');
  });

  describe('isUrlAlreadyShortened', () => {
    it('should return true because the url is already shortened', async () => {
      const shortenUrl = `${config.getConfig().front.domain}/test123`;

      const result = service.isUrlAlreadyShortened(shortenUrl);
      expect(result).toBeTruthy();
    });

    it('should return false because the url is not shortened', async () => {
      const result = service.isUrlAlreadyShortened(ORIGINAL_URL);
      expect(result).toBe(false);
    });
  });

  describe('getUrlFromDb', () => {
    it('should return url', async () => {
      prisma.url.findFirst = jest.fn().mockReturnValueOnce({
        originalUrl: 'original_url',
      });
      const result = await service.getUrlFromDb('good_url');
      expect(result).toBe('original_url');
    });

    it('should return null if url not found', async () => {
      prisma.url.findFirst = jest.fn().mockReturnValueOnce(undefined);
      const result = await service.getUrlFromDb('not_found_url');
      expect(result).toBeNull();
    });

    it('should return null if url is expired', async () => {
      prisma.url.findFirst = jest.fn().mockReturnValueOnce({
        originalUrl: 'original_url',
        expirationTime: new Date(Date.now() - 1000 * 60),
      });
      const result = await service.getUrlFromDb('expired_url');
      expect(result).toBeNull();
    });

    it('should return url if expiration time bigger than now', async () => {
      prisma.url.findFirst = jest.fn().mockReturnValueOnce({
        originalUrl: 'original_url',
        expirationTime: new Date(Date.now() + 1000 * 60),
      });
      const result = await service.getUrlFromDb('good_url');
      expect(result).toBe('original_url');
    });
  });

  describe('createShortenedUrl', () => {
    it('should return a shortened url', async () => {
      jest.spyOn(service, 'generateShortenedUrl').mockReturnValue('best');
      jest.spyOn(service, 'isShortenedUrlAvailable').mockResolvedValue(true);
      jest.spyOn(service, 'addUrl').mockResolvedValue(undefined);
      jest.spyOn(service, 'isUrlAlreadyShortened').mockReturnValue(false);

      const body: ShortenerDto = { originalUrl: ORIGINAL_URL };
      const short = await service.createShortenedUrl(body.originalUrl);
      expect(short).toStrictEqual({ newUrl: 'best' });
    });

    it('should throw an error of invalid url', () => {
      const body: ShortenerDto = { originalUrl: 'invalid-url' };
      expect(async () => {
        await service.createShortenedUrl(body.originalUrl);
      }).rejects.toThrow(BadRequestException);
    });

    it('should throw an error if the original URL is already shortened', async () => {
      jest.spyOn(service, 'isUrlAlreadyShortened').mockReturnValue(true);
      const body: ShortenerDto = { originalUrl: ORIGINAL_URL };
      try {
        await service.createShortenedUrl(body.originalUrl);
        throw new Error('Expected an error to be thrown!');
      } catch (err) {
        expect(err.message).toBe('The URL is already shortened...');
      }
    });

    it('should throw an Invalid URL error if the original URL is not url', async () => {
      const body: ShortenerDto = { originalUrl: 'some_non_url_string' };
      try {
        await service.createShortenedUrl(body.originalUrl);
        throw new Error('Expected an error to be thrown!');
      } catch (err) {
        expect(err.message).toBe('Invalid URL');
      }
    });

    it('should return an error if addUrl method throws an error', () => {
      jest.spyOn(service, 'generateShortenedUrl').mockReturnValue('best');
      jest.spyOn(service, 'isShortenedUrlAvailable').mockResolvedValue(true);
      jest
        .spyOn(service, 'addUrl')
        .mockRejectedValue(new Error('Error adding URL to the database'));
      const body: ShortenerDto = { originalUrl: ORIGINAL_URL };
      expect(async () => {
        await service.createShortenedUrl(body.originalUrl);
      }).rejects.toThrow();
    });
  });

  describe('getOriginalUrl', () => {
    it('should return original url if it is return form cache', async () => {
      jest.spyOn(service, 'getUrlFromCache').mockResolvedValue('cached.url');
      jest.spyOn(service, 'getUrlFromDb').mockResolvedValue('db.url');

      const result = await service.getOriginalUrl('shortened_url');
      expect(result).toBe('cached.url');
    });

    it('should return original url if it is return form db', async () => {
      jest.spyOn(service, 'getUrlFromCache').mockResolvedValue(null);
      jest.spyOn(service, 'getUrlFromDb').mockResolvedValue('db.url');

      const result = await service.getOriginalUrl('shortened_url');
      expect(result).toBe('db.url');
    });

    it('should return null if url not found', async () => {
      jest.spyOn(service, 'getUrlFromCache').mockResolvedValue(null);
      jest.spyOn(service, 'getUrlFromDb').mockResolvedValue(null);

      const result = await service.getOriginalUrl('shortened_url');
      expect(result).toBeNull();
    });
  });

  describe('createDbUrl', () => {
    it('should return url data', async () => {
      const body = { originalUrl: ORIGINAL_URL };
      const user = { id: USER_ID } as UserContext;
      const newUrl = 'best_url_shortener';

      const result = await service.createDbUrl(body, user, newUrl);
      expect(result).toEqual(URL_DB_DATA);
    });
  });

  describe('createUsersShortUrl', () => {
    it('should return shortened url', async () => {
      jest.spyOn(service, 'createShortenedUrl').mockResolvedValue({ newUrl: 'best_url_shortener' });

      const body = { originalUrl: ORIGINAL_URL };
      const user = { id: USER_ID } as UserContext;
      const result = await service.createUsersShortUrl(user, body);
      expect(result).toEqual({ newUrl: 'best_url_shortener' });
    });

    it('should return null newUrl if createShortenedUrl return it', async () => {
      jest.spyOn(service, 'createShortenedUrl').mockResolvedValue({ newUrl: null });

      const body = { originalUrl: ORIGINAL_URL };
      const user = { id: USER_ID } as UserContext;
      const result = await service.createUsersShortUrl(user, body);
      expect(result).toEqual({ newUrl: null });
    });
  });
});
