import { Module } from '@nestjs/common';
import { AppConfigService } from '@reduced.to/config';
import { Kafka, logLevel } from 'kafkajs';
import { AppLoggerService } from '@reduced.to/logger';
import { mockQueueManager } from './__mocks__/queue-manager.mock';

export const QUEUE_MANAGER_INJECTION_TOKEN = 'QUEUE_MANAGER';

const queueManagerFactory = {
  provide: QUEUE_MANAGER_INJECTION_TOKEN,
  useFactory: async (config: AppConfigService, logger: AppLoggerService) => {
    const kafkaConfig = config.getConfig().kafka;

    // Do not connect to Kafka in test environment / if Kafka is disabled
    if (config.getConfig().general.env === 'test' || kafkaConfig.enable === false) {
      logger.debug('Kafka is disabled or we are in test environment');
      return mockQueueManager();
    }

    return new Kafka({
      brokers: [kafkaConfig.broker],
      ssl: true,
      sasl: {
        mechanism: 'scram-sha-256',
        username: kafkaConfig.username,
        password: kafkaConfig.password,
      },
      logLevel: logLevel.ERROR,
    });
  },
  inject: [AppConfigService, AppLoggerService],
};

@Module({
  providers: [queueManagerFactory],
  exports: [queueManagerFactory],
})
export class QueueManagerModule {}
