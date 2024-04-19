import { Inject, OnModuleInit } from '@nestjs/common';
import { QueueManagerService } from '../queue-manager.service';
import { AppLoggerService } from '@reduced.to/logger';
import { Consumer, KafkaMessage } from 'kafkajs';

export abstract class ConsumerService implements OnModuleInit {
  @Inject(AppLoggerService) private readonly logger: AppLoggerService;
  @Inject(QueueManagerService) private readonly queueManager: QueueManagerService;

  private consumer: Consumer;
  constructor(
    private readonly topic: string,
    private readonly options?: {
      groupId: string;
      consumerName: string;
    }
  ) {
    this.options = {
      groupId: this.options?.groupId || 'default-group',
      consumerName: this.options?.consumerName || 'default-consumer',
    };
  }

  async onModuleInit() {
    this.consumer = this.queueManager.client.consumer({ groupId: this.options.groupId });
    await this.consumer.connect();
    await this.consumer.subscribe({ topic: this.topic });

    // Running the consumer
    await this.consumer
      .run({
        eachMessage: async ({ topic, partition, message }) => {
          await this.onMessage(topic, partition, message);
        },
      })
      .catch((err) => {
        this.logger.error(`Error on consumer ${this.name} on topic ${this.topic}`, err);
      });
  }

  get name() {
    return this.options.consumerName;
  }

  get topicName() {
    return this.topic;
  }

  abstract onMessage(topic: string, partition: number, message: KafkaMessage): Promise<void>;
}
