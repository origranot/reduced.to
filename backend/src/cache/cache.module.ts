import { CacheModule, CacheStore, Global, Module } from '@nestjs/common';
import { redisStore } from 'cache-manager-redis-store';
import { AppConfigModule } from '../config/config.module';
import { AppConfigService } from '../config/config.service';
import { AppCacheService } from './cache.service';

@Global()
@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [AppConfigModule],
      useFactory: async (config: AppConfigService) => {
        if (!config.getConfig().redis.enable) {
          return CacheModule.register({
            ttl: 0, // Unlimited time
          });
        }

        const store = await redisStore({
          socket: {
            host: config.getConfig().redis.host,
            port: config.getConfig().redis.port,
          },
        });

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
