import { ShortenerModule } from './shortener.module';
import { ShortenerService } from './shortener.service';
import { Test, TestingModule } from '@nestjs/testing';
import { AppCacheModule } from '../cache/cache.module';
import { AppCacheService } from '../cache/cache.service';

describe('ShortenerService', () => {
  let service: ShortenerService;
  let cache: AppCacheService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppCacheModule, ShortenerModule],
      providers: [ShortenerService],
    }).compile();

    cache = module.get<AppCacheService>(AppCacheService);
    service = module.get<ShortenerService>(ShortenerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should generate a string with 5 random characters', () => {
    const shortUrl = service.generateShortUrl();
    expect(shortUrl).toHaveLength(5);
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
