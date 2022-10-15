import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ShortenerModule } from './shortener/shortener.module';
import { AppCacheModule } from './cache/cache.module';

@Module({
  imports: [AppCacheModule, ShortenerModule],
  controllers: [AppController],
})
export class AppModule {}
