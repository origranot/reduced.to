import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ShortenerModule } from './shortener/shortener.module';
import { AppCacheModule } from './cache/cache.module';
import { AppConfigModule } from './config/config.module';

@Module({
  imports: [AppConfigModule, AppCacheModule, ShortenerModule],
  controllers: [AppController],
})
export class AppModule {}
