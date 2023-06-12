import { Module } from '@nestjs/common';
import { AppConfigService } from '../config/config.service';
import { memphis } from 'memphis-dev';

export const MEMPHIS_INJECTION_TOKEN = Symbol.for('MEMPHIS');

const memphisFactory = {
  provide: MEMPHIS_INJECTION_TOKEN,
  useFactory: async (config: AppConfigService) => {
    await memphis.connect({
      ...config.getConfig().memphis,
    });

    return memphis;
  },
  inject: [AppConfigService],
};

@Module({
  providers: [memphisFactory],
  exports: [memphisFactory],
})
export class BrokerModule {}
