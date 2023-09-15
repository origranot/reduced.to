import { Module } from '@nestjs/common';
import { AppConfigService } from '@reduced.to/config';
import { memphis } from 'memphis-dev';

export const QUEUE_MANAGER_INJECTION_TOKEN = 'QUEUE_MANAGER';

const queueManagerFactory = {
  provide: QUEUE_MANAGER_INJECTION_TOKEN,
  useFactory: async (config: AppConfigService) => {
    const memphisConfig = config.getConfig().memphis;
    const memphisConnection = await memphis.connect(memphisConfig);
    return memphisConnection;
  },
  inject: [AppConfigService],
};

@Module({
  providers: [queueManagerFactory],
  exports: [queueManagerFactory],
})
export class QueueManagerModule {}
