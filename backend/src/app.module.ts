import { CacheModule, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ShortenerModule } from './shortener/shortener.module';

@Module({
  imports: [
    CacheModule.register({
      isGlobal: true,
      ttl: 0, // Unlimited time
    }),
    ShortenerModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
