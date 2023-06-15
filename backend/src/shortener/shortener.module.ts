import { Module } from '@nestjs/common';
import { ShortenerController } from './shortener.controller';
import { ShortenerService } from './services/shortener/shortener.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AnalyticsService } from './services/analytics/analytics.service';
import { MemphisModule } from '../memphis/memphis.module';

@Module({
  imports: [PrismaModule, MemphisModule],
  controllers: [ShortenerController],
  providers: [ShortenerService, AnalyticsService],
  exports: [ShortenerService],
})
export class ShortenerModule {}
