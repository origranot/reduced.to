import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './auth/auth.module';
import { AppCacheModule } from './cache/cache.module';
import { AppConfigModule } from './config/config.module';
import { AppConfigService } from './config/config.service';
import { AppLoggerModule } from './logger/logger.module';
import { NovuModule } from './novu/novu.module';
import { PrismaService } from '@reduced.to/prisma';
import { UniqueConstraint } from './shared/decorators/unique/unique.decorator';
import { CustomThrottlerGuard } from './shared/guards/custom-throttler/custom-throttler';
import { ShortenerModule } from './shortener/shortener.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    AppConfigModule,
    AppLoggerModule,
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
    NovuModule,
    UsersModule,
  ],
  providers: [
    PrismaService,
    UniqueConstraint,
    {
      provide: APP_GUARD,
      useClass: CustomThrottlerGuard,
    },
  ],
})
export class AppModule {}
