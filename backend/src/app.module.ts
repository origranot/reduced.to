import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { ShortenerModule } from './shortener/shortener.module';
import { AppCacheModule } from './cache/cache.module';

@Module({
  imports: [
    AppCacheModule,
    ShortenerModule,
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10,
    })
  ],
  controllers: [AppController],
})
export class AppModule {}
