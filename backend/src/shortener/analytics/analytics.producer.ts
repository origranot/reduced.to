import { Inject, Injectable } from '@nestjs/common';
import { MEMPHIS_INJECTION_TOKEN } from '../../memphis/memphis.module';
import { MemphisService } from 'memphis-dev';

const PRODUCER_NAME = 'analyticsProducer';
const STATION_NAME = 'analytics';

@Injectable()
export class AnalyticsProducer {
  constructor(@Inject(MEMPHIS_INJECTION_TOKEN) private readonly memphis: MemphisService) {}

  public produce = async (message: any) => {
    this.memphis.produce({
      stationName: STATION_NAME,
      producerName: PRODUCER_NAME,
      message,
    });
  };
}
