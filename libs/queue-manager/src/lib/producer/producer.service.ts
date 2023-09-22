import { Inject, Injectable } from '@nestjs/common';
import { QueueManagerService } from '@reduced.to/queue-manager';
import { AppConfigService } from '@reduced.to/config';
import { AppLoggerSerivce } from '@reduced.to/logger';

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
    // Do not publish if Memphis is disabled
    if (!this.config.getConfig().memphis.enable) {
      return;
    }

    this.logger.log(`Publishing message to ${this.queueName} with producer ${this.producerName}`);
    return this.queueManager.client.produce({
      stationName: this.queue,
      producerName: this.name,
      message,
    });
  }
}
