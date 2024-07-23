// Unit tests for: onMessage

import geoip from 'geoip-lite';

import { VisitsConsumer } from '../visits.consumer';

type MockKafkaMessage = {
  value: {
    toString: () => string;
  };
};

class MockAppConfigService {
  public getConfig = jest.fn().mockReturnValue({
    tracker: {
      stats: {
        topic: 'test-topic',
      },
    },
  });
}

class MockAppLoggerService {
  public debug = jest.fn();
  public log = jest.fn();
}

class MockPrismaService {
  public link = {
    findUnique: jest.fn(),
  };
}

class MockVisitsService {
  public isUnique = jest.fn();
  public add = jest.fn();
}

class MockUsageService {
  public isEligibleToTrackClicks = jest.fn();
  public incrementClicksCount = jest.fn();
}

describe('VisitsConsumer.onMessage() onMessage method', () => {
  let visitsConsumer: VisitsConsumer;
  let mockConfigService: MockAppConfigService;
  let mockLoggerService: MockAppLoggerService;
  let mockPrismaService: MockPrismaService;
  let mockVisitsService: MockVisitsService;
  let mockUsageService: MockUsageService;

  beforeEach(() => {
    mockConfigService = new MockAppConfigService();
    mockLoggerService = new MockAppLoggerService();
    mockPrismaService = new MockPrismaService();
    mockVisitsService = new MockVisitsService();
    mockUsageService = new MockUsageService();

    visitsConsumer = new VisitsConsumer(
      mockConfigService as any,
      mockLoggerService as any,
      mockPrismaService as any,
      mockVisitsService as any,
      mockUsageService as any
    );
  });

  it('should process a valid message and add a unique visit', async () => {
    // Arrange
    const message: MockKafkaMessage = {
      value: JSON.stringify({
        ip: '192.168.1.1',
        userAgent: 'Mozilla/5.0',
        key: 'test-key',
        url: 'http://example.com',
      }),
    } as any;

    mockPrismaService.link.findUnique.mockResolvedValue({ userId: 'user-id' } as any);
    mockUsageService.isEligibleToTrackClicks.mockResolvedValue(true);
    mockVisitsService.isUnique.mockResolvedValue(true);
    mockVisitsService.add.mockResolvedValue(undefined);
    mockUsageService.incrementClicksCount.mockResolvedValue(undefined);

    // Act
    await visitsConsumer.onMessage('test-topic', 0, message as any);

    // Assert
    expect(mockLoggerService.debug).toHaveBeenCalledWith(expect.stringContaining('Received message for test-key'));
    expect(mockVisitsService.add).toHaveBeenCalledWith('test-key', expect.any(Object));
    expect(mockUsageService.incrementClicksCount).toHaveBeenCalledWith('user-id');
  });

  it('should skip processing if user is not found', async () => {
    // Arrange
    const message: MockKafkaMessage = {
      value: JSON.stringify({
        ip: '192.168.1.1',
        userAgent: 'Mozilla/5.0',
        key: 'test-key',
        url: 'http://example.com',
      }),
    } as any;

    mockPrismaService.link.findUnique.mockResolvedValue(null);

    // Act
    await visitsConsumer.onMessage('test-topic', 0, message as any);

    // Assert
    expect(mockLoggerService.debug).toHaveBeenCalledWith('Could not find user id for key: ', 'test-key');
  });

  it('should skip processing if user is not eligible to track clicks', async () => {
    // Arrange
    const message: MockKafkaMessage = {
      value: JSON.stringify({
        ip: '192.168.1.1',
        userAgent: 'Mozilla/5.0',
        key: 'test-key',
        url: 'http://example.com',
      }),
    } as any;

    mockPrismaService.link.findUnique.mockResolvedValue({ userId: 'user-id' } as any);
    mockUsageService.isEligibleToTrackClicks.mockResolvedValue(false);

    // Act
    await visitsConsumer.onMessage('test-topic', 0, message as any);

    // Assert
    expect(mockLoggerService.debug).toHaveBeenCalledWith('User has reached the limit of tracked clicks');
  });

  it('should skip processing if visit is not unique', async () => {
    // Arrange
    const message: MockKafkaMessage = {
      value: JSON.stringify({
        ip: '192.168.1.1',
        userAgent: 'Mozilla/5.0',
        key: 'test-key',
        url: 'http://example.com',
      }),
    } as any;

    mockPrismaService.link.findUnique.mockResolvedValue({ userId: 'user-id' } as any);
    mockUsageService.isEligibleToTrackClicks.mockResolvedValue(true);
    mockVisitsService.isUnique.mockResolvedValue(false);

    // Act
    await visitsConsumer.onMessage('test-topic', 0, message as any);

    // Assert
    expect(mockVisitsService.add).not.toHaveBeenCalled();
  });

  it('should skip processing if the user agent is a bot', async () => {
    // Arrange
    const message: MockKafkaMessage = {
      value: JSON.stringify({
        ip: '192.168.1.1',
        userAgent: 'Googlebot/2.1 (+http://www.google.com/bot.html)',
        key: 'test-key',
        url: 'http://example.com',
      }),
    } as any;

    mockPrismaService.link.findUnique.mockResolvedValue({ userId: 'user-id' } as any);
    mockUsageService.isEligibleToTrackClicks.mockResolvedValue(true);
    mockVisitsService.isUnique.mockResolvedValue(true);

    // Act
    await visitsConsumer.onMessage('test-topic', 0, message as any);

    // Assert
    expect(mockLoggerService.debug).toHaveBeenCalledWith(expect.stringContaining('Bot detected for test-key'));
    expect(mockVisitsService.add).not.toHaveBeenCalled();
  });

  it('should handle geo location lookup', async () => {
    // Arrange
    const message: MockKafkaMessage = {
      value: JSON.stringify({
        ip: '192.168.1.1',
        userAgent: 'Mozilla/5.0',
        key: 'test-key',
        url: 'http://example.com',
      }),
    } as any;

    mockPrismaService.link.findUnique.mockResolvedValue({ userId: 'user-id' } as any);
    mockUsageService.isEligibleToTrackClicks.mockResolvedValue(true);
    mockVisitsService.isUnique.mockResolvedValue(true);
    mockVisitsService.add.mockResolvedValue(undefined);
    mockUsageService.incrementClicksCount.mockResolvedValue(undefined);

    // Mock geoip lookup
    jest.spyOn(geoip, 'lookup').mockReturnValue({ country: 'US', city: 'New York' } as any);

    // Act
    await visitsConsumer.onMessage('test-topic', 0, message as any);

    // Assert
    expect(mockLoggerService.debug).toHaveBeenCalledWith(expect.stringContaining('Parsed ip 192.168.1.1 to geo location:'));
    expect(mockVisitsService.add).toHaveBeenCalledWith(
      'test-key',
      expect.objectContaining({
        geoLocation: { country: 'US', city: 'New York' },
      })
    );
  });
});

// End of unit tests for: onMessage
