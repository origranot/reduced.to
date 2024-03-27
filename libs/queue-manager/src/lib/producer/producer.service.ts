import { Inject } from '@nestjs/common';
import { QueueManagerService } from '../queue-manager.service';
import { AppConfigService } from '@rt/config';
import { AppLoggerSerivce } from '@rt/logger';

export abstract class ProducerService {
  @Inject(AppLoggerSerivce) private readonly logger: AppLoggerSerivce;
  @Inject(AppConfigService) private readonly config: AppConfigService;
  @Inject(QueueManagerService) private readonly queueManager: QueueManagerService;

  constructor(private readonly producerName: string, private readonly queue: string) {}

  get name() {
    return this.producerName;
  }

  get queueName() {
    return this.queue;
  }

  async publish(message: any) {
    // Do not publish if Memphis is disabled or if we are in test environment
    if (this.config.getConfig().general.env === 'test' || !this.config.getConfig().memphis.enable) {
      return;
    }

    this.logger.debug(`Publishing message to ${this.queueName} with producer ${this.producerName}`);
    return this.queueManager.client.produce({
      stationName: this.queue,
      producerName: this.name,
      message,
    });
  }
}
