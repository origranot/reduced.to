import { Global, Module } from '@nestjs/common';
import { AppConfigService } from '@reduced.to/config';
import { memphis } from 'memphis-dev';

export const QUEUE_MANAGER_INJECTION_TOKEN = 'QUEUE_MANAGER';

const queueManagerFactory = {
  provide: QUEUE_MANAGER_INJECTION_TOKEN,
  useFactory: async (config: AppConfigService) => {
    const memphisConfig = config.getConfig().memphis;

    // Do not connect to Memphis in test environment / if Memphis is disabled
    if (config.getConfig().general.env === 'test' || memphisConfig.enable === false) {
      return;
    }

    const memphisConnection = await memphis.connect(memphisConfig);
    return memphisConnection;
  },
  inject: [AppConfigService],
};

@Global()
@Module({
  providers: [queueManagerFactory],
  exports: [queueManagerFactory],
})
export class QueueManagerModule {}
