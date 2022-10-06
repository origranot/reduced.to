import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppRoutingModule } from './routes/app-routing.module';
import { ShortenerModule } from './shortener/shortener.module';

@Module({
  imports: [
    ShortenerModule,
    AppRoutingModule
  ],
  controllers: [AppController]
})
export class AppModule {}
