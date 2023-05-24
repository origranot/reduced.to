import { CacheModule, CacheStore, Global, Module } from '@nestjs/common';
import { RedisStore, redisStore } from 'cache-manager-redis-store';
import { AppConfigModule } from '../config/config.module';
import { AppConfigService } from '../config/config.service';
import { AppCacheService } from './cache.service';
import { TtlUtil } from '../auth/utils/ttl.util';

@Global()
@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [AppConfigModule],
      useFactory: async (config: AppConfigService) => {
        let store: string | RedisStore = 'memory';

        if (config.getConfig().redis.enable) {
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
  providers: [AppCacheService, TtlUtil],
  exports: [AppCacheService, TtlUtil],
})
export class AppCacheModule {}
