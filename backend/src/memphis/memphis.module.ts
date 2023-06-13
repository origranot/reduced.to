import { Module } from '@nestjs/common';
import { AppConfigService } from '../config/config.service';
import { memphis } from 'memphis-dev';
import { MemphisServiceMock } from './__mocks__/memphis.service';

export const MEMPHIS_INJECTION_TOKEN = Symbol.for('MEMPHIS');

const memphisFactory = {
  provide: MEMPHIS_INJECTION_TOKEN,
  useFactory: async (config: AppConfigService) => {
    const memphisConfig = config.getConfig().memphis;
    if (!memphisConfig.enable) {
      // If memphis is disabled, return a mock service that does nothing
      return new MemphisServiceMock();
    }

    await memphis.connect({
      ...memphisConfig,
    });

    return memphis;
  },
  inject: [AppConfigService],
};

@Module({
  providers: [memphisFactory],
  exports: [memphisFactory],
})
export class MemphisModule {}
