import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { AnalyticsProducer } from './analytics.producer';

@Injectable()
export class AnalyticsService {
  constructor(private readonly analyticsProducer: AnalyticsProducer) {}

  async trackRequest(request: Request, shortenedUrl: string): Promise<void> {
    return this.analyticsProducer.produce({
      stationName: 'analytics',
      producerName: 'requestTracker',
      message: {
        request,
        shortenedUrl,
      },
    });
  }
}
