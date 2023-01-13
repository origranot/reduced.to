import { Test, TestingModule } from '@nestjs/testing';
import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { AppCacheService } from './cache.service';

interface CacheMock extends Cache {
  get: jest.Mock<Promise<any>, [string]>;
  set: jest.Mock<Promise<any>, [string, any]>;
}

describe('AppCacheService', () => {
  let service: AppCacheService;
  let cache: CacheMock;

  beforeEach(async () => {
    cache = {
      ...jest.genMockFromModule<Cache>('cache-manager'),
      set: jest.fn(),
      get: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppCacheService,
        {
          provide: CACHE_MANAGER,
          useValue: cache,
        },
      ],
    }).compile();

    service = module.get<AppCacheService>(AppCacheService);
  });

  it('should set value to cache', () => {
    service.set('key', 'value');
    expect(cache.set).toHaveBeenCalledWith('key', 'value');
  });

  it('should get value from cache', async () => {
    cache.get.mockResolvedValueOnce('value');
    const result = await service.get('key');
    expect(cache.get).toHaveBeenCalledWith('key');
    expect(result).toEqual('value');
  });

  it('should handle null value when getting value from cache', async () => {
    cache.get.mockResolvedValueOnce(null);
    const result = await service.get('key');
    expect(cache.get).toHaveBeenCalledWith('key');
    expect(result).toBe(null);
  });

  it('should handle undefined value when getting value from cache', async () => {
    cache.get.mockResolvedValueOnce(undefined);
    const result = await service.get('key');
    expect(cache.get).toHaveBeenCalledWith('key');
    expect(result).toBe(undefined);
  });

  it('should handle rejected promises when setting value to cache', async () => {
    cache.set.mockRejectedValueOnce('error');
    try {
      await service.set('key', 'value');
    } catch (error) {
      expect(error).toEqual('error');
    }
    expect(cache.set).toHaveBeenCalledWith('key', 'value');
  });

  it('should handle rejected promises when getting value from cache', async () => {
    cache.get.mockImplementationOnce(() => Promise.reject('error'));
    try {
      await service.get('key');
    } catch (err) {
      expect(err).toEqual('error');
    }
    expect(cache.get).toHaveBeenCalledWith('key');
  });

  it('should get the cache manager', () => {
    expect(service.getCacheManager).toBe(cache);
  });
});
