import { AppConfigService } from '../config/config.service';
import { ShortenerModule } from './shortener.module';
import { ShortenerService } from './shortener.service';
import { Test, TestingModule } from '@nestjs/testing';
import { AppCacheModule } from '../cache/cache.module';
import { AppCacheService } from '../cache/cache.service';
import { AppConfigModule } from '../config/config.module';
import { PrismaService } from '../prisma/prisma.service';
import { ShortenerDto } from './dto';
import { Request } from 'express';
import { BadRequestException } from '@nestjs/common';

describe('ShortenerService', () => {
  let service: ShortenerService;
  let config: AppConfigService;
  let cache: AppCacheService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppConfigModule, AppCacheModule, ShortenerModule],
      providers: [
        ShortenerService,
        {
          provide: PrismaService,
          useValue: {
            shortUrl: {
              create: jest.fn(),
              findFirst: jest.fn(),
            },
          },
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

  it('should generate a short url with 5 random characters', () => {
    const shortUrl = service.generateShortUrl();
    expect(shortUrl).toHaveLength(5);
  });

  it('should generate a short url with only alphanumeric characters', () => {
    const shortUrl = service.generateShortUrl();
    expect(shortUrl).toMatch(/^[a-z0-9]+$/i);
  });

  it('should add url to cache store', async () => {
    const ORIGINAL_URL = 'https://github.com/origranot/reduced.to';
    const SHORT_URL = 'best_url_shortener';

    await service.addUrl(ORIGINAL_URL, SHORT_URL);

    const keys = await cache.getCacheManager.store.keys();
    expect(keys).toHaveLength(1);

    const orignalUrl = await service.getOriginalUrl(SHORT_URL);
    expect(orignalUrl).toBe(ORIGINAL_URL);
  });

  it('should add url to cache store', async () => {
    const ORIGINAL_URL = 'https://github.com/origranot/reduced.to';
    const SHORT_URL = 'best_url_shortener';

    await service.addUrl(ORIGINAL_URL, SHORT_URL);

    const keys = await cache.getCacheManager.store.keys();
    expect(keys).toHaveLength(1);

    const orignalUrl = await service.getOriginalUrl(SHORT_URL);
    expect(orignalUrl).toBe(ORIGINAL_URL);
  });

  it('should return null if short url not found in cache', async () => {
    const SHORT_URL = 'best_url_shortener';
    const originalUrl = await service.getOriginalUrl(SHORT_URL);
    expect(originalUrl).toBeNull();
  });

  describe('isShortUrlAvailable', () => {
    it('should return true because short url is avaliable', async () => {
      const SHORT_URL = 'best_url_shortener';

      const isAvailable = await service.isShortUrlAvailable(SHORT_URL);
      expect(isAvailable).toBeTruthy();
    });

    it('should return false because short url is taken', async () => {
      const ORIGINAL_URL = 'https://github.com/origranot/reduced.to';
      const SHORT_URL = 'best_url_shortener';

      await service.addUrl(ORIGINAL_URL, SHORT_URL);
      const isAvailable = await service.isShortUrlAvailable(SHORT_URL);
      expect(isAvailable).toBeFalsy();
    });
  });

  it('should throw an error if short url is already taken', async () => {
    const originalUrl = 'https://github.com/origranot/reduced.to';
    const shortUrl = 'best_url_shortener';

    await service.addUrl(originalUrl, shortUrl);
    await expect(async () => {
      await service.addUrl(originalUrl, shortUrl);
    }).rejects.toThrowError('Short URL already taken');
  });

  describe('isUrlAlreadyShortend', () => {
    it('should return true because the url is already shortened', async () => {
      const shortenUrl = `${config.getConfig().front.domain}/test123`;

      const result = service.isUrlAlreadyShortend(shortenUrl);
      expect(result).toBeTruthy();
    });

    it('should return false because the url is not shortened', async () => {
      const url = 'https://github.com/origranot/reduced.to';

      const result = service.isUrlAlreadyShortend(url);
      expect(result).toBe(false);
    });
  });

  describe('getPremiumUrl', () => {
    it('should return the premium url', async () => {
      prisma.shortUrl.findFirst = jest.fn().mockReturnValueOnce({
        originalUrl: 'original_url',
      });
      const result = await service.getPremiumUrl('good_url');
      expect(result).toBe('original_url');
    });

    it('should return null if the premium url is not found', async () => {
      prisma.shortUrl.findMany = jest.fn().mockReturnValueOnce(undefined);
      const result = await service.getPremiumUrl('expired_url');
      expect(result).toBe(null);
    });
  });

  describe('getShortUrl', () => {
    it('should return a shortern url', async () => {
      jest.spyOn(service, 'generateShortUrl').mockReturnValue('best');
      jest.spyOn(service, 'isShortUrlAvailable').mockResolvedValue(true);
      jest.spyOn(service, 'addUrl').mockResolvedValue(undefined);
      jest.spyOn(service, 'isUrlAlreadyShortend').mockReturnValue(false);

      const body: ShortenerDto = { originalUrl: 'https://github.com/origranot/reduced.to' };
      const req = {} as any as Request;
      const short = await service.createShortUrl(body);
      expect(short).toStrictEqual({ newUrl: 'best' });
    });

    it('should throw an error of invalid url', () => {
      const body: ShortenerDto = { originalUrl: 'invalid-url' };
      expect(async () => {
        await service.createShortUrl(body);
      }).rejects.toThrow(BadRequestException);
    });

    it('should throw an error if the original URL is already shortened', async () => {
      jest.spyOn(service, 'isUrlAlreadyShortend').mockReturnValue(true);
      const body: ShortenerDto = { originalUrl: 'https://github.com/origranot/reduced.to' };
      try {
        await service.createShortUrl(body);
        throw new Error('Expected an error to be thrown!');
      } catch (err) {
        expect(err.message).toBe('The URL is already shortened...');
      }
    });

    it('should throw an Invalid URL error if the original URL is not url', async () => {
      const body: ShortenerDto = { originalUrl: 'some_non_url_string' };
      try {
        await service.createShortUrl(body);
        throw new Error('Expected an error to be thrown!');
      } catch (err) {
        expect(err.message).toBe('Invalid URL');
      }
    });

    it('should return an error if addUrl method throws an error', () => {
      jest.spyOn(service, 'generateShortUrl').mockReturnValue('best');
      jest.spyOn(service, 'isShortUrlAvailable').mockResolvedValue(true);
      jest
        .spyOn(service, 'addUrl')
        .mockRejectedValue(new Error('Error adding URL to the database'));
      const body: ShortenerDto = { originalUrl: 'https://github.com/origranot/reduced.to' };
      expect(async () => {
        await service.createShortUrl(body);
      }).rejects.toThrow();
    });
  });
});
