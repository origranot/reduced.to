import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './auth/auth.module';
import { AppCacheModule } from './cache/cache.module';
import { AppConfigModule, AppConfigService } from '@reduced.to/config';
import { AppLoggerModule } from '@reduced.to/logger';
import { PrismaService } from '@reduced.to/prisma';
import { UniqueConstraint } from './shared/decorators/unique/unique.decorator';
import { CustomThrottlerGuard } from './shared/guards/custom-throttler/custom-throttler';
import { ShortenerModule } from './shortener/shortener.module';
import { UsersModule } from './core/users/users.module';
import { LinksService } from './core/links/links.service';
import { LinksController } from './core/links/links.controller';

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
    UsersModule,
    UsersModule,
  ],
  providers: [
    PrismaService,
    UniqueConstraint,
    {
      provide: APP_GUARD,
      useClass: CustomThrottlerGuard,
    },
    LinksService,
  ],
  controllers: [LinksController],
})
export class AppModule {}
