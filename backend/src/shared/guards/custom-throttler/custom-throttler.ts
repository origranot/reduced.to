import { Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { AppLoggerSerivce } from '../../../logger/logger.service';

@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
  protected getTracker(req: Record<string, any>): string {
    const ip = req.ips.length ? req.ips[0] : req.ip;
    console.log(`Throttling request from ${ip}`);

    return req.ips.length ? req.ips[0] : req.ip; // individualize IP extraction
  }

  protected errorMessage = 'You have exceeded the rate limit for accessing this resource. Please try again later.';
}
