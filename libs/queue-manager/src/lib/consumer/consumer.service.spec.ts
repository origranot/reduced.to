import { Test, TestingModule } from '@nestjs/testing';
import { Injectable } from '@nestjs/common';
import { AppLoggerModule } from '@reduced.to/logger';
import { QueueManagerService } from '../queue-manager.service';
import { QueueManagerModule } from '../queue-manager.module';
import { ConsumerService } from './consumer.service';
import { AppConfigModule } from '@reduced.to/config';

jest.mock('../queue-manager.service');

describe('ConsumerService', () => {
  const TEST_CONSUMER_NAME = 'test-consumer';
  const TEST_QUEUE_NAME = 'test-queue';

  @Injectable()
  class TestConsumerService extends ConsumerService {
    constructor() {
      super(TEST_CONSUMER_NAME, TEST_QUEUE_NAME);
    }

    async onMessage(message: any) {
      console.log('TestConsumerService', message);
    }
  }

  let service: TestConsumerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppConfigModule, AppLoggerModule, QueueManagerModule],
      providers: [TestConsumerService, QueueManagerService],
    }).compile();

    service = module.get<TestConsumerService>(TestConsumerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should get the producer name', () => {
    expect(service.name).toBe(TEST_CONSUMER_NAME);
  });

  it('should get the queue name', () => {
    expect(service.queueName).toBe(TEST_QUEUE_NAME);
  });
});
