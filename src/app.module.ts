import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ShortenerModule } from './modules';
import { AppRouterModule } from './routes';

@Module({
  imports: [
    ShortenerModule,
    AppRouterModule
  ],
  controllers: [AppController],
  providers: [AppService],
  
})
export class AppModule {}
