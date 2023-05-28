import { Test, TestingModule } from '@nestjs/testing';
import { TtlUtil } from './ttl.util';
import { AppConfigService } from '../../config/config.service';
import { AppConfigModule } from '../../config/config.module';

describe('TtlUtil', () => {
  let ttlUtil: TtlUtil;
  let config: AppConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppConfigModule],
      providers: [TtlUtil],
    }).compile();

    config = module.get<AppConfigService>(AppConfigService);
    ttlUtil = module.get<TtlUtil>(TtlUtil);
  });

  it('should be defined', () => {
    expect(ttlUtil).toBeDefined();
  });

  describe('convertExpirationTimeToTtl', () => {
    it('should return null if expirationTime has falsy value', () => {
      const expirationTime = null;
      const ttl = ttlUtil.convertExpirationTimeToTtl(expirationTime);
      expect(ttl).toBeNull();
    });

    it('should return null if expiration time is smaller than now', () => {
      const expirationTime = '2021-01-01 00:00:00';
      const ttl = ttlUtil.convertExpirationTimeToTtl(expirationTime);
      expect(ttl).toBeNull();
    });

    it('should return ttl if expiration time is bigger than now', () => {
      const date = new Date().setTime(new Date().getTime() + 1000 * 60 * 60 * 24 * 390);
      const year = new Date(date).getFullYear();
      const expirationTime = `${year}-01-01 00:00:00`;
      const ttl = ttlUtil.convertExpirationTimeToTtl(expirationTime);
      expect(ttl).toBeDefined();
      expect(ttl).toBeGreaterThan(0);
      expect(typeof ttl).toBe('number');
    });
  });

  describe('getSmallerTtl', () => {
    it('should return ttl if ttl is smaller than redis ttl', () => {
      const ttl = 100;
      const smallerTtl = ttlUtil.getSmallerTtl(ttl);
      expect(smallerTtl).toBe(ttl);
    });

    it('should return redis ttl if ttl is bigger than redis ttl', () => {
      const ttl = 1000000;
      const smallerTtl = ttlUtil.getSmallerTtl(ttl);
      expect(smallerTtl).toBe(config.getConfig().redis.ttl);
    });
  });
});
