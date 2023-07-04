import { Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { Request } from 'express';

@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
  protected getTracker(req: Request): string {
    return this.getIp(req);
  }

  protected errorMessage = 'You have exceeded the rate limit for accessing this resource. Please try again later.';

  private getIp(req: Request): string {
    const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress;
    return ip;
  }
}
