import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ShortenerModule } from './shortener/shortener.module';
import { AppCacheModule } from './cache/cache.module';
import { ThrottlerModule } from '@nestjs/throttler';

import { AppConfigModule } from './config/config.module';
import { AppConfigService } from './config/config.service';

@Module({
  imports: [
    AppConfigModule,
    AppCacheModule,
    ThrottlerModule.forRootAsync({
      inject: [AppConfigService],
      useFactory: (config: AppConfigService) => ({
        ttl: config.getConfig().rateLimit.ttl,
        limit: config.getConfig().rateLimit.limit,
      }),
    }),
    ShortenerModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
