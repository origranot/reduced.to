import { Test, TestingModule } from '@nestjs/testing';
import { ProducerService } from './producer.service';
import { AppConfigModule } from '@reduced.to/config';
import { Injectable } from '@nestjs/common';
import { AppLoggerModule } from '@reduced.to/logger';
import { QueueManagerService } from '../queue-manager.service';
import { QueueManagerModule } from '../queue-manager.module';

jest.mock('../queue-manager.service');

describe('ProducerService', () => {
  const TEST_PRODUCER_NAME = 'test-producer';
  const TEST_QUEUE_NAME = 'test-queue';

  @Injectable()
  class TestProducerService extends ProducerService {
    constructor() {
      super(TEST_PRODUCER_NAME, TEST_QUEUE_NAME);
    }
  }

  let service: TestProducerService;
  let queueManager: QueueManagerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppConfigModule, AppLoggerModule, QueueManagerModule],
      providers: [TestProducerService],
    }).compile();

    service = module.get<TestProducerService>(TestProducerService);
    queueManager = module.get<QueueManagerService>(QueueManagerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should get the producer name', () => {
    expect(service.name).toBe(TEST_PRODUCER_NAME);
  });

  it('should get the queue name', () => {
    expect(service.queueName).toBe(TEST_QUEUE_NAME);
  });

  it('should publish a message to the queue', async () => {
    console.log(queueManager);
    const queueManagerSpy = jest.spyOn(queueManager.client, 'produce');

    const PAYLOAD = { message: 'test', 1: 2 };

    await service.publish(PAYLOAD);
    expect(queueManagerSpy).toBeCalledTimes(1);
    expect(queueManagerSpy).toBeCalledWith({
      stationName: TEST_QUEUE_NAME,
      producerName: TEST_PRODUCER_NAME,
      message: PAYLOAD,
    });
  });
});
