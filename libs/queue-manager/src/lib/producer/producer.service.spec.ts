import { Inject } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ProducerService, QUEUE_MANAGER_INJECTION_TOKEN, QueueManagerModule } from '@reduced.to/queue-manager';
import { Memphis } from 'memphis-dev';
import { AppConfigModule } from '@reduced.to/config';

describe('ProducerService', () => {
  class TestProducerService extends ProducerService {
    constructor(@Inject(QUEUE_MANAGER_INJECTION_TOKEN) queueManager: Memphis) {
      super(queueManager, 'test-producer');
    }
  }

  let service: TestProducerService;

  beforeEach(async () => {
    jest.setTimeout(600000);
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppConfigModule, QueueManagerModule],
      providers: [TestProducerService],
    }).compile();

    service = module.get<TestProducerService>(TestProducerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should publish a message to the queue', async () => {
    const test = await service.publish('test-queue', 'test-message');
    console.log(test);
  });
});
