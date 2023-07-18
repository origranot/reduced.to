import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class AppCacheService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  set = this.cacheManager.set;
  get = this.cacheManager.get;

  getCacheManager = this.cacheManager;
}
