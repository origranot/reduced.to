import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppRouterModule } from './routes';
import { ShortenerModule } from './shortener';

@Module({
  imports: [
    ShortenerModule,
    AppRouterModule
  ],
  controllers: [AppController]
})
export class AppModule {}
