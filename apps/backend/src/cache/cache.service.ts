import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

export interface LinkValue {
  url: string;
  key: string;
  password?: string;
}

@Injectable()
export class AppCacheService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async set(key: string, value: LinkValue, ttl?: number) {
    return this.cacheManager.set(key, value, ttl);
  }

  async get(key: string) {
    return this.cacheManager.get<LinkValue>(key);
  }

  async del(key: string) {
    return this.cacheManager.del(key);
  }

  getCacheManager = this.cacheManager;
}
