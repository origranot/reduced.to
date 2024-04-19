import { Test, TestingModule } from '@nestjs/testing';
import { ProducerService } from './producer.service';
import { AppConfigModule, AppConfigService } from '@reduced.to/config';
import { Injectable } from '@nestjs/common';
import { AppLoggerModule } from '@reduced.to/logger';
import { QueueManagerService } from '../queue-manager.service';
import { QueueManagerModule } from '../queue-manager.module';

describe('ProducerService', () => {
  const TEST_PRODUCER_NAME = 'test-producer';
  const TEST_TOPIC_NAME = 'test-topic';

  @Injectable()
  class TestProducerService extends ProducerService {
    constructor() {
      super(TEST_PRODUCER_NAME, TEST_TOPIC_NAME);
    }
  }

  let service: TestProducerService;
  let queueManagerService: QueueManagerService;
  let configService: AppConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppConfigModule, AppLoggerModule, QueueManagerModule],
      providers: [
        TestProducerService,
        {
          provide: QueueManagerService,
          useValue: {
            client: {
              producer: jest.fn().mockReturnValue({
                connect: jest.fn(),
                disconnect: jest.fn(),
                send: jest.fn(),
              }),
            },
          },
        },
      ],
    }).compile();

    service = module.get<TestProducerService>(TestProducerService);
    queueManagerService = module.get<QueueManagerService>(QueueManagerService);
    configService = module.get<AppConfigService>(AppConfigService);

    await service.init();
  });

  afterEach(async () => {
    await service.terminate();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should get the producer name', () => {
    expect(service.name).toBe(TEST_PRODUCER_NAME);
  });

  it('should get the queue name', () => {
    expect(service.topicName).toBe(TEST_TOPIC_NAME);
  });

  it('should not publish a message to the queue if we are in test environment', async () => {
    const sendSpy = jest.spyOn(service['producer'], 'send');

    const PAYLOAD = { message: 'test', 1: 2 };

    await service.publish(PAYLOAD);
    expect(sendSpy).toBeCalledTimes(0);
  });

  it('should not publish a message to the queue if queue-manager is disabled', async () => {
    const configMock = jest.spyOn(configService, 'getConfig');
    configMock.mockReturnValue({ general: { env: 'development' }, kafka: { enable: false } } as any);

    const sendSpy = jest.spyOn(service['producer'], 'send');

    const PAYLOAD = { message: 'test', 1: 2 };

    await service.publish(PAYLOAD);
    expect(sendSpy).toBeCalledTimes(0);
  });

  // It is not actually going to publish a message to the queue, but it is going to call the produce method of the queue-manager mock
  it('should publish a message to the queue if we are not in test environment', async () => {
    // Mock the config service to return the development environment
    const configMock = jest.spyOn(configService, 'getConfig');
    configMock.mockReturnValue({ general: { env: 'development' }, kafka: { enable: true } } as any);

    const sendSpy = jest.spyOn(service['producer'], 'send');

    const PAYLOAD = { message: 'test', 1: 2 };

    await service.publish(PAYLOAD);
    expect(sendSpy).toBeCalledTimes(1);
    expect(sendSpy).toBeCalledWith({
      topic: TEST_TOPIC_NAME,
      messages: [{ value: JSON.stringify(PAYLOAD) }],
    });
  });
});
