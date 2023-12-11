import { Inject, OnModuleInit } from '@nestjs/common';
import { QueueManagerService } from '../queue-manager.service';
import { AppLoggerSerivce } from '@reduced.to/logger';
import { Consumer } from 'memphis-dev/*';

export abstract class ConsumerService implements OnModuleInit {
  @Inject(AppLoggerSerivce) private readonly logger: AppLoggerSerivce;
  @Inject(QueueManagerService) private readonly queueManager: QueueManagerService;

  private _consumer: Consumer;
  constructor(private readonly consumerName: string, private readonly queue: string) {}

  async onModuleInit() {
    this._consumer = await this.queueManager.client.consumer({
      stationName: this.queue,
      consumerName: this.consumerName,
    });

    this.registerEvents();
  }

  get name() {
    return this.consumerName;
  }

  get queueName() {
    return this.queue;
  }

  abstract onMessage(message: any): Promise<void>;

  private registerEvents() {
    this._consumer.on('message', async (message) => {
      this.logger.debug(`Received message from queue ${this.queueName} for consumer ${this.name}`);
      this.onMessage(message);
    });
  }
}
