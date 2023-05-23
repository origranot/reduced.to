import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { AppConfigService } from '../config/config.service';

@Injectable()
export class AppCacheService {
  constructor(
    private readonly appConfigService: AppConfigService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}

  set = this.cacheManager.set;
  get = this.cacheManager.get;

  getCacheManager = this.cacheManager;

  convertExpirationTimeToTtl(expirationTime: string): number {
    if (!expirationTime) {
      return null;
    }
    const expirationTimeAsNumber = Number(expirationTime);
    const now = new Date().getTime();
    if (expirationTimeAsNumber < now) {
      return null;
    }
    return (expirationTimeAsNumber - now) / 1000;
  }

  getSmallerTtl(customTtl: number) {
    const defaultTtl = this.appConfigService.getConfig().cache.ttl;
    if (defaultTtl) {
      return Math.min(customTtl, defaultTtl);
    } else {
      return customTtl;
    }
  }
}
