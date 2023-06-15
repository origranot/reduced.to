import { Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { AppLoggerSerivce } from '../../../logger/logger.service';
import { Request } from 'express';

@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
  protected getTracker(req: Request): string {
    const ip = req.headers['x-forwarded-for'] || req.ips.length ? req.ips[0] : req.ip;
    console.log(ip);
    return req.headers['x-forwarded-for'] || req.ips.length ? req.ips[0] : req.ip;
  }

  protected errorMessage = 'You have exceeded the rate limit for accessing this resource. Please try again later.';
}
