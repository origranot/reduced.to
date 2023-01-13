import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Configuration } from './config.factory';

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  getConfig(): Configuration {
    const config = this.configService.get<Configuration>('config');
    if (!config) {
      throw new ConfigNotFoundError();
    }
    return config;
  }
}

export class ConfigNotFoundError extends Error {
  constructor() {
    super('Configuration not found');
  }
}
