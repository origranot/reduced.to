import { Module } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { AnalyticsProducer } from './analytics.producer';
import { MemphisModule } from '../../memphis/memphis.module';

@Module({
  imports: [MemphisModule],
  providers: [AnalyticsService, AnalyticsProducer],
  exports: [AnalyticsService, AnalyticsProducer],
})
export class AnalyticsModule {}
