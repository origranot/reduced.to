import { PrismaService } from './prisma.service';
import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppCacheModule } from './cache/cache.module';
import { ShortenerModule } from './shortener/shortener.module';

import { AuthModule } from './auth/auth.module';
import { AppConfigModule } from './config/config.module';
import { AppConfigService } from './config/config.service';
import { UniqueConstraint } from './shared/decorators/unique.decorator';
import { MailModule } from './mail/mail.module';

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
    MailModule,
  ],
  controllers: [AppController],
  providers: [PrismaService, UniqueConstraint],
})
export class AppModule {}
