import { AppConfigService } from '@rt/config';
import { ShortenerService } from '@rt/backend/shortener/shortener.service';
import { Test, TestingModule } from '@nestjs/testing';
import { AppCacheModule } from '@rt/backend/cache/cache.module';
import { AppCacheService } from '@rt/backend/cache/cache.service';
import { AppConfigModule } from '@rt/config';
import { PrismaService } from '@rt/prisma';
import { ShortenerDto } from '@rt/backend/shortener/dto';
import { BadRequestException } from '@nestjs/common';
import { UserContext } from '@rt/backend/auth/interfaces/user-context';

const FIXED_SYSTEM_TIME = '1999-01-01T00:00:00Z';

describe('ShortenerService', () => {
  let service: ShortenerService;
  let config: AppConfigService;
  let cache: AppCacheService;
  let prisma: PrismaService;

  let createLinkPrismaSpy: jest.SpyInstance;
  let setRedisKeySpy: jest.SpyInstance;

  const ORIGINAL_URL = 'https://github.com/origranot/reduced.to';
  const USER_ID = '26419f47-97bd-4f28-ba2d-a33c224fa4af';
  const KEY = 'best_url_shortener';
  const LINK_DB_DATA = {
    id: USER_ID,
    key: KEY,
    url: ORIGINAL_URL,
    userId: USER_ID,
    description: null,
    expirationTime: null,
    createdAt: '2023-05-28T15:16:06.837Z',
  };

  beforeAll(async () => {
    jest.useFakeTimers();
    jest.setSystemTime(Date.parse(FIXED_SYSTEM_TIME));
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppConfigModule, AppCacheModule],
      providers: [
        ShortenerService,
        {
          provide: PrismaService,
          useFactory: () => ({
            link: {
              create: jest.fn().mockResolvedValue(LINK_DB_DATA),
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

    createLinkPrismaSpy = jest.spyOn(prisma.link, 'create');
    setRedisKeySpy = jest.spyOn(cache.getCacheManager.store, 'set');

    await cache.getCacheManager.reset();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getLinkFromCache', () => {
    it('should return null if short url not found in cache', async () => {
      const url = await service.getLinkFromCache(KEY);
      expect(url).toBeNull();
    });
  });

  describe('generateKey', () => {
    it('should generate a key with 5 random characters', () => {
      const key = service.generateKey();
      expect(key).toHaveLength(5);
    });

    it('should generate a key with only alphanumeric characters', () => {
      const key = service.generateKey();
      expect(key).toMatch(/^[a-z0-9]+$/i);
    });
  });

  describe('addLinkToCache', () => {
    it('should add url to cache store', async () => {
      await service.addLinkToCache(ORIGINAL_URL, KEY);

      const keys = await cache.getCacheManager.store.keys();
      expect(keys).toHaveLength(1);

      const url = await service.getLinkFromCache(KEY);
      expect(url).toBe(ORIGINAL_URL);
    });

    it('should add url to cache store with correct ttl if ttl is not provided', async () => {
      await service.addLinkToCache(ORIGINAL_URL, KEY);
      expect(setRedisKeySpy).toBeCalledWith(KEY, ORIGINAL_URL, config.getConfig().redis.ttl);
    });

    it('should add url to cache store with correct ttl if ttl is bigger than default ttl', async () => {
      await service.addLinkToCache(ORIGINAL_URL, KEY, config.getConfig().redis.ttl + 10000000000);
      expect(setRedisKeySpy).toBeCalledWith(KEY, ORIGINAL_URL, config.getConfig().redis.ttl);
    });

    it('should add url to cache store with correct ttl if ttl is smaller than default ttl', async () => {
      await service.addLinkToCache(ORIGINAL_URL, KEY, config.getConfig().redis.ttl - 1000);
      expect(setRedisKeySpy).toBeCalledWith(KEY, ORIGINAL_URL, config.getConfig().redis.ttl - 1000);
    });
  });

  describe('isShortUrlAvailable', () => {
    it('should return true because short url is available', async () => {
      const isAvailable = await service.isKeyAvailable(KEY);
      expect(isAvailable).toBeTruthy();
    });

    it('should return false because short url is taken', async () => {
      await service.addLinkToCache(ORIGINAL_URL, KEY);
      const isAvailable = await service.isKeyAvailable(KEY);
      expect(isAvailable).toBeFalsy();
    });
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

  describe('getLinkFromDb', () => {
    let addLinkToCache: jest.SpyInstance;

    beforeEach(() => {
      addLinkToCache = jest.spyOn(service, 'addLinkToCache');
    });

    it('should return link', async () => {
      prisma.link.findFirst = jest.fn().mockReturnValueOnce({
        url: ORIGINAL_URL,
      });

      const result = await service.getLinkFromDb('good_url');
      expect(addLinkToCache).toBeCalledTimes(1);
      expect(addLinkToCache).toBeCalledWith(ORIGINAL_URL, 'good_url', undefined);
      expect(result).toBe(ORIGINAL_URL);
    });

    it('should return null if link not found', async () => {
      prisma.link.findFirst = jest.fn().mockReturnValueOnce(undefined);
      const result = await service.getLinkFromDb('not_found_url');
      expect(addLinkToCache).toBeCalledTimes(0);
      expect(result).toBeNull();
    });

    it('should return null if link is expired', async () => {
      prisma.link.findFirst = jest.fn().mockReturnValueOnce({
        url: ORIGINAL_URL,
        expirationTime: new Date(Date.now() - 1000 * 60),
      });

      const result = await service.getLinkFromDb('expired_url');
      expect(addLinkToCache).toBeCalledTimes(0);
      expect(result).toBeNull();
    });

    it('should return url if expiration time bigger than now and add the url to the cache', async () => {
      const mockedExpirationTime = new Date(Date.now() + 1000 * 60);
      prisma.link.findFirst = jest.fn().mockReturnValueOnce({
        url: ORIGINAL_URL,
        expirationTime: mockedExpirationTime,
      });

      const result = await service.getLinkFromDb('good_url');
      expect(addLinkToCache).toBeCalledTimes(1);
      expect(addLinkToCache).toBeCalledWith(ORIGINAL_URL, 'good_url', mockedExpirationTime.getTime() - Date.now());
      expect(result).toBe(ORIGINAL_URL);
    });
  });

  describe('createShortenedUrl', () => {
    it('should return a shortened url', async () => {
      jest.spyOn(service, 'generateKey').mockReturnValue('best');
      jest.spyOn(service, 'isKeyAvailable').mockResolvedValue(true);
      jest.spyOn(service, 'addLinkToCache').mockResolvedValue(undefined);
      jest.spyOn(service, 'isUrlAlreadyShortened').mockReturnValue(false);

      const body: ShortenerDto = { url: ORIGINAL_URL };
      const short = await service.createShortenedUrl(body.url);
      expect(short).toStrictEqual({ key: 'best' });
    });

    it('should throw an error of invalid url', () => {
      const body: ShortenerDto = { url: 'invalid-url' };
      expect(async () => {
        await service.createShortenedUrl(body.url);
      }).rejects.toThrow(BadRequestException);
    });

    it('should throw an error if the original URL is already shortened', async () => {
      jest.spyOn(service, 'isUrlAlreadyShortened').mockReturnValue(true);
      const body: ShortenerDto = { url: ORIGINAL_URL };
      try {
        await service.createShortenedUrl(body.url);
        throw new Error('Expected an error to be thrown!');
      } catch (err) {
        expect(err.message).toBe('The URL is already shortened...');
      }
    });

    it('should throw an Invalid URL error if the original URL is not url', async () => {
      const body: ShortenerDto = { url: 'non_url_string' };
      try {
        await service.createShortenedUrl(body.url);
        throw new Error('Expected an error to be thrown!');
      } catch (err) {
        expect(err.message).toBe('Invalid URL');
      }
    });

    it('should return an error if addLinkToCache method throws an error', () => {
      jest.spyOn(service, 'generateKey').mockReturnValue('best');
      jest.spyOn(service, 'isKeyAvailable').mockResolvedValue(true);
      jest.spyOn(service, 'addLinkToCache').mockRejectedValue(new Error('Error adding URL to the cache'));
      const body: ShortenerDto = { url: ORIGINAL_URL };
      expect(async () => {
        await service.createShortenedUrl(body.url);
      }).rejects.toThrow();
    });
  });

  describe('getUrl', () => {
    it('should return original url if it is return form cache', async () => {
      jest.spyOn(service, 'getLinkFromCache').mockResolvedValue('cached.url');
      jest.spyOn(service, 'getLinkFromDb').mockResolvedValue('db.url');

      const result = await service.getUrl('shortened_url');
      expect(result).toBe('cached.url');
    });

    it('should return original url if it is return form db', async () => {
      jest.spyOn(service, 'getLinkFromCache').mockResolvedValue(null);
      jest.spyOn(service, 'getLinkFromDb').mockResolvedValue('db.url');

      const result = await service.getUrl('shortened_url');
      expect(result).toBe('db.url');
    });

    it('should return null if url not found', async () => {
      jest.spyOn(service, 'getLinkFromCache').mockResolvedValue(null);
      jest.spyOn(service, 'getLinkFromDb').mockResolvedValue(null);

      const result = await service.getUrl('shortened_url');
      expect(result).toBeNull();
    });
  });

  describe('createDbUrl', () => {
    it('should return url data', async () => {
      const body = { url: ORIGINAL_URL };
      const user = { id: USER_ID } as UserContext;
      const key = 'best_url_shortener';

      const result = await service.createDbUrl(user, body, key);
      expect(result).toEqual(LINK_DB_DATA);
    });

    it('should create url with description', async () => {
      const body = { url: ORIGINAL_URL, description: 'best description' };
      const user = { id: USER_ID } as UserContext;
      const key = 'best_url_shortener';

      const result = await service.createDbUrl(user, body, key);
      expect(createLinkPrismaSpy).toBeCalledWith({
        data: {
          key,
          url: body.url,
          userId: user.id,
          description: body.description,
        },
      });
      expect(result).toEqual(LINK_DB_DATA);
    });

    it('should create url with correct expiration time', async () => {
      const body = {
        url: ORIGINAL_URL,
        expirationTime: new Date(FIXED_SYSTEM_TIME).getTime(),
      };
      const user = { id: USER_ID } as UserContext;
      const key = 'best_url_shortener';

      const result = await service.createDbUrl(user, body, key);
      expect(createLinkPrismaSpy).toBeCalledWith({
        data: {
          key,
          url: body.url,
          userId: user.id,
          expirationTime: new Date(FIXED_SYSTEM_TIME),
        },
      });
      expect(result).toEqual(LINK_DB_DATA);
    });
  });

  describe('createUsersShortenedUrl', () => {
    it('should return shortened url', async () => {
      jest.spyOn(service, 'createShortenedUrl').mockResolvedValue({ key: 'best_url_shortener' });

      const shortenerDto: ShortenerDto = { url: ORIGINAL_URL };
      const user = { id: USER_ID } as UserContext;
      const result = await service.createUsersShortenedUrl(user, shortenerDto);
      expect(result).toEqual({ key: 'best_url_shortener' });
    });

    it('should return null key if createShortenedUrl return it', async () => {
      jest.spyOn(service, 'createShortenedUrl').mockResolvedValue({ key: null });

      const shortenerDto: ShortenerDto = { url: ORIGINAL_URL };
      const user = { id: USER_ID } as UserContext;
      const result = await service.createUsersShortenedUrl(user, shortenerDto);
      expect(result).toEqual({ key: null });
    });
  });
});
