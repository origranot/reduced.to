import { Inject, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { MemphisService } from 'memphis-dev';
import { MEMPHIS_INJECTION_TOKEN } from '../../../memphis/memphis.module';

const ANALYTICS_STATION_NAME = 'analytics';
const REQUEST_TRACKER_PRODUCER_NAME = 'requestTracker';

@Injectable()
export class AnalyticsService {
  constructor(@Inject(MEMPHIS_INJECTION_TOKEN) private readonly memphis: MemphisService) {}

  async trackRequest(request: Request, shortenedUrl: string): Promise<void> {
    return this.produce({
      request,
      shortenedUrl,
    });
  }

  private async produce(message: any): Promise<void> {
    return this.memphis.produce({
      stationName: ANALYTICS_STATION_NAME,
      producerName: REQUEST_TRACKER_PRODUCER_NAME,
      message,
    });
  }
}
