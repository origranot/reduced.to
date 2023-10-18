import { Test, TestingModule } from '@nestjs/testing';
import { ProducerService } from './producer.service';
import { AppConfigModule, AppConfigService } from '@reduced.to/config';
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
  let configService: AppConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppConfigModule, AppLoggerModule, QueueManagerModule],
      providers: [TestProducerService, QueueManagerService],
    }).compile();

    service = module.get<TestProducerService>(TestProducerService);
    queueManager = module.get<QueueManagerService>(QueueManagerService);
    configService = module.get<AppConfigService>(AppConfigService);
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

  it('should not publish a message to the queue if we are in test environment', async () => {
    const queueManagerSpy = jest.spyOn(queueManager.client, 'produce');

    const PAYLOAD = { message: 'test', 1: 2 };

    await service.publish(PAYLOAD);
    expect(queueManagerSpy).toBeCalledTimes(0);
  });

  it('should not publish a message to the queue if queue-manager is disabled', async () => {
    const configMock = jest.spyOn(configService, 'getConfig');
    configMock.mockReturnValue({ general: { env: 'development' }, memphis: { enable: false } } as any);

    const queueManagerSpy = jest.spyOn(queueManager.client, 'produce');

    const PAYLOAD = { message: 'test', 1: 2 };

    await service.publish(PAYLOAD);
    expect(queueManagerSpy).toBeCalledTimes(0);
  });

  // It is not actually going to publish a message to the queue, but it is going to call the produce method of the queue-manager mock
  it('should publish a message to the queue if we are not in test environment', async () => {
    // Mock the config service to return the development environment
    const configMock = jest.spyOn(configService, 'getConfig');
    configMock.mockReturnValue({ general: { env: 'development' }, memphis: { enable: true } } as any);

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
