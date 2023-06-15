import { Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { AppLoggerSerivce } from '../../../logger/logger.service';

@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
  protected getTracker(req: Record<string, any>): string {
    console.log(`Throttling request from`, req);

    return req.ips.length ? req.ips[0] : req.ip; // individualize IP extraction
  }

  protected errorMessage = 'You have exceeded the rate limit for accessing this resource. Please try again later.';
}
