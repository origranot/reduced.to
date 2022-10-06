import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ShortenerModule } from './modules';
import { AppRouterModule } from './routes';

@Module({
  imports: [
    ShortenerModule,
    AppRouterModule
  ],
  controllers: [AppController]
})
export class AppModule {}
