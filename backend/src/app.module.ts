import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppCacheModule } from './cache/cache.module';
import { ShortenerModule } from './shortener/shortener.module';

import { AuthModule } from './auth/auth.module';
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
    AuthModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
