import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './auth/auth.module';
import { RolesGuard } from './auth/guards/roles.guard';
import { AppCacheModule } from './cache/cache.module';
import { AppConfigModule } from './config/config.module';
import { AppConfigService } from './config/config.service';
import { AppLoggerModule } from './logger/logger.module';
import { NovuModule } from './novu/novu.module';
import { PrismaService } from './prisma/prisma.service';
import { UniqueConstraint } from './shared/decorators/unique/unique.decorator';
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
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
