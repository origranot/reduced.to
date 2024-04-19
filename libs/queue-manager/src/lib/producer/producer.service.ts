import { Inject, Injectable } from '@nestjs/common';
import { QueueManagerService } from '../queue-manager.service';
import { AppConfigService } from '@reduced.to/config';
import { AppLoggerService } from '@reduced.to/logger';
import { Producer } from 'kafkajs';

@Injectable()
export abstract class ProducerService {
  @Inject(AppLoggerService) private readonly logger: AppLoggerService;
  @Inject(AppConfigService) private readonly config: AppConfigService;
  @Inject(QueueManagerService) private readonly queueManager: QueueManagerService;

  private producer: Producer;
  constructor(private readonly producerName: string, private readonly topic: string) {}

  async init() {
    this.logger.debug(`Initializing ${this.producerName} producer`);
    this.producer = this.queueManager.client.producer({
      allowAutoTopicCreation: true,
    });

    return this.producer.connect();
  }

  async terminate() {
    this.logger.debug(`Terminating producer ${this.producerName}`);
    return this.producer.disconnect();
  }

  get name() {
    return this.producerName;
  }

  get topicName() {
    return this.topic;
  }

  async publish(message: any) {
    // Do not publish if Kafka is disabled or if we are in test environment
    if (this.config.getConfig().general.env === 'test' || !this.config.getConfig().kafka.enable) {
      return;
    }

    this.logger.debug(`Publishing message to ${this.topic} with producer ${this.producerName}`);
    return this.producer.send({
      topic: this.topic,
      messages: [{ value: JSON.stringify(message) }],
    });
  }
}
