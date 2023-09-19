import { Inject } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ProducerService, QUEUE_MANAGER_INJECTION_TOKEN, QueueManagerModule, QueueManagerService } from '@reduced.to/queue-manager';
import { Memphis } from 'memphis-dev';
import { AppConfigModule } from '@reduced.to/config';

jest.mock('../queue-manager.service');

describe('ProducerService', () => {

  const TEST_PRODUCER_NAME = 'test-producer';
  class TestProducerService extends ProducerService {
    constructor(@Inject(QUEUE_MANAGER_INJECTION_TOKEN) queueManager: Memphis) {
      super(queueManager, TEST_PRODUCER_NAME);
    }
  }

  let service: TestProducerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppConfigModule, QueueManagerModule],
      providers: [TestProducerService],
    }).compile();

    service = module.get<TestProducerService>(TestProducerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should get the queue manager', () => {
    expect(service.getQueueManager()).toBeDefined();
  });

  it('should get the producer name', () => {
    expect(service.getName()).toBe(TEST_PRODUCER_NAME);
  });

  it('should publish a message to the queue', async () => {
    const queueManagerSpy = jest.spyOn(service.getQueueManager(), 'produce');

    const QUEUE_NAME = 'test-queue';
    const PAYLOAD = { message: 'test', 1: 2 };

    await service.publish(QUEUE_NAME, PAYLOAD);
    expect(queueManagerSpy).toBeCalledTimes(1);
    expect(queueManagerSpy).toBeCalledWith({
      stationName: QUEUE_NAME,
      producerName: TEST_PRODUCER_NAME,
      message: PAYLOAD,
    });
  });
});
