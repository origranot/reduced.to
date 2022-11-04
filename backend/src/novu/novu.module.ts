import { Module } from '@nestjs/common';
import { AppConfigService } from '../config/config.service';
import { Novu } from '@novu/node';

export const NOVU_INJECTION_TOKEN = 'NOVU';

const novuFactory = {
  provide: NOVU_INJECTION_TOKEN,
  useFactory: (config: AppConfigService) => {
    const apiKey = config.getConfig().novu.apiKey;
    return new Novu(apiKey);
  },
  inject: [AppConfigService],
};

@Module({
  providers: [novuFactory],
  exports: [novuFactory],
})
export class NovuModule {}
