import { CacheModule, CacheStore } from '@nestjs/cache-manager';
import { Global, Module } from '@nestjs/common';
import { RedisStore, redisStore } from 'cache-manager-redis-store';
import { AppConfigService, AppConfigModule } from '@rt/config';
import { AppCacheService } from '@rt/backend/cache/cache.service';

@Global()
@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [AppConfigModule],
      useFactory: async (config: AppConfigService) => {
        let store: string | RedisStore = 'memory';

        // Only use Redis in non-test environments and if it's enabled in the config
        if (process.env.NODE_ENV !== 'test' && config.getConfig().redis.enable) {
          store = await redisStore({
            socket: {
              host: config.getConfig().redis.host,
              port: config.getConfig().redis.port,
            },
            password: config.getConfig().redis.password,
            ttl: config.getConfig().redis.ttl,
          });
        }

        return {
          store: store as unknown as CacheStore,
          ttl: config.getConfig().redis.ttl,
        };
      },
      inject: [AppConfigService],
    }),
  ],
  providers: [AppCacheService],
  exports: [AppCacheService],
})
export class AppCacheModule {}
