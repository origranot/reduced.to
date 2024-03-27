import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from '@rt/backend/auth/auth.module';
import { AppCacheModule } from '@rt/backend/cache/cache.module';
import { AppConfigModule, AppConfigService } from '@rt/config';
import { AppLoggerModule } from '@rt/logger';
import { PrismaService } from '@rt/prisma';
import { UniqueConstraint } from '@rt/backend/shared/decorators/unique/unique.decorator';
import { CustomThrottlerGuard } from '@rt/backend/shared/guards/custom-throttler/custom-throttler';
import { ShortenerModule } from '@rt/backend/shortener/shortener.module';
import { UsersModule } from '@rt/backend/core/users/users.module';
import { LinksService } from '@rt/backend/core/links/links.service';
import { LinksModule } from '@rt/backend/core/links/links.module';
import { ReportsModule } from '@rt/backend/core/reports/reports.module';

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
    LinksModule,
    ReportsModule,
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
})
export class AppModule {}
