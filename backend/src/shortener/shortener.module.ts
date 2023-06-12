import { Module } from '@nestjs/common';
import { ShortenerController } from './shortener.controller';
import { ShortenerService } from './shortener.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AnalyticsProducer } from '../broker/producers/analytics.producer';
import { BrokerModule } from '../broker/broker.module';
import { AnalyticsModule } from './analytics/analytics.module';

@Module({
  imports: [PrismaModule, BrokerModule, AnalyticsModule],
  controllers: [ShortenerController],
  providers: [ShortenerService, AnalyticsProducer],
  exports: [ShortenerService],
})
export class ShortenerModule {}
