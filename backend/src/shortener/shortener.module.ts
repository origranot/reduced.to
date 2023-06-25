import { Module } from '@nestjs/common';
import { ShortenerController } from './shortener.controller';
import { ShortenerService } from './shortener.service';
import { PrismaModule } from '../prisma/prisma.module';
import { UrlsModule } from '../urls/urls.module';

@Module({
  imports: [PrismaModule, UrlsModule],
  controllers: [ShortenerController],
  providers: [ShortenerService],
  exports: [ShortenerService],
})
export class ShortenerModule {}
