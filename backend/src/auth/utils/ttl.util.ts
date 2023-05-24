import { Injectable } from '@nestjs/common';
import { AppConfigService } from '../../config/config.service';

@Injectable()
export class TtlUtil {
  constructor(private readonly appConfigService: AppConfigService) {}

  convertExpirationTimeToTtl(expirationTime: string): number {
    if (!expirationTime) {
      return null;
    }
    const expirationTimeAsNumber = Number(expirationTime);
    const now = new Date().getTime();
    if (expirationTimeAsNumber < now) {
      return null;
    }
    return (expirationTimeAsNumber - now) / 1000;
  }

  getSmallerTtl(ttl: number) {
    return Math.min(ttl, this.appConfigService.getConfig().redis.ttl);
  }
}
