import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IConfiguration } from './config.factory';

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  getConfig(): IConfiguration {
    return this.configService.get('config', { infer: true });
  }
}
