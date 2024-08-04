// Unit tests for: add

import geoip from 'geoip-lite';

import { VisitsService } from '../visits.service';

class MockPrismaService {
  public visit = {
    create: jest.fn(),
    count: jest.fn(),
  };

  public link = {
    update: jest.fn(),
  };

  public $transaction = jest.fn((callback) => callback(this));
}

describe('VisitsService.add() add method', () => {
  let visitsService: VisitsService;
  let mockPrismaService: MockPrismaService;

  beforeEach(() => {
    mockPrismaService = new MockPrismaService();
    visitsService = new VisitsService(mockPrismaService as any);
  });

  describe('Happy Path', () => {
    it('should successfully add a visit and increment link clicks', async () => {
      const key = 'test-key';
      const opts = {
        hashedIp: 'hashed-ip',
        ua: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
        geoLocation: {
          country: 'US',
          region: 'CA',
          city: 'Los Angeles',
        } as geoip.Lookup,
      };

      // Mock the return value of parseUa
      jest.spyOn(visitsService, 'parseUa' as any).mockResolvedValue({
        browser: 'Chrome',
        os: 'Windows',
        device: 'Desktop',
      } as any);

      await visitsService.add(key, opts);

      expect(mockPrismaService.visit.create).toHaveBeenCalledWith({
        data: {
          ip: opts.hashedIp,
          userAgent: opts.ua,
          browser: 'Chrome',
          os: 'Windows',
          device: 'Desktop',
          geo: opts.geoLocation,
          country: 'US',
          region: 'CA',
          city: 'Los Angeles',
          link: { connect: { key } },
        },
      } as any);

      expect(mockPrismaService.link.update).toHaveBeenCalledWith({
        where: { key },
        data: { clicks: { increment: 1 } },
      } as any);
    });
  });

  describe('Edge Cases', () => {
    it('should handle missing geoLocation gracefully', async () => {
      const key = 'test-key';
      const opts = {
        hashedIp: 'hashed-ip',
        ua: 'Mozilla/5.0',
        geoLocation: null,
      };

      jest.spyOn(visitsService, 'parseUa' as any).mockResolvedValue({
        browser: 'Chrome',
        os: 'Windows',
        device: 'Desktop',
      } as any);

      await visitsService.add(key, opts);

      expect(mockPrismaService.visit.create).toHaveBeenCalledWith({
        data: {
          ip: opts.hashedIp,
          userAgent: opts.ua,
          browser: 'Chrome',
          os: 'Windows',
          device: 'Desktop',
          geo: null,
          country: null,
          region: null,
          city: null,
          link: { connect: { key } },
        },
      } as any);
    });

    it('should handle empty user agent string', async () => {
      const key = 'test-key';
      const opts = {
        hashedIp: 'hashed-ip',
        ua: '',
        geoLocation: {
          country: 'US',
          region: 'CA',
          city: 'Los Angeles',
        } as geoip.Lookup,
      };

      jest.spyOn(visitsService, 'parseUa' as any).mockResolvedValue({
        browser: null,
        os: null,
        device: 'Desktop',
      } as any);

      await visitsService.add(key, opts);

      expect(mockPrismaService.visit.create).toHaveBeenCalledWith({
        data: {
          ip: opts.hashedIp,
          userAgent: opts.ua,
          browser: null,
          os: null,
          device: 'Desktop',
          geo: opts.geoLocation,
          country: 'US',
          region: 'CA',
          city: 'Los Angeles',
          link: { connect: { key } },
        },
      } as any);
    });

    it('should handle unknown device type', async () => {
      const key = 'test-key';
      const opts = {
        hashedIp: 'hashed-ip',
        ua: 'Mozilla/5.0 (Linux; Android 10; Pixel 3 XL) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.106 Mobile Safari/537.36',
        geoLocation: {
          country: 'US',
          region: 'CA',
          city: 'Los Angeles',
        } as geoip.Lookup,
      };

      jest.spyOn(visitsService, 'parseUa' as any).mockResolvedValue({
        browser: 'Chrome',
        os: 'Android',
        device: undefined, // Simulating unknown device type
      } as any);

      await visitsService.add(key, opts);

      expect(mockPrismaService.visit.create).toHaveBeenCalledWith({
        data: {
          ip: opts.hashedIp,
          userAgent: opts.ua,
          browser: 'Chrome',
          os: 'Android',
          device: 'Desktop', // Defaulting to Desktop
          geo: opts.geoLocation,
          country: 'US',
          region: 'CA',
          city: 'Los Angeles',
          link: { connect: { key } },
        },
      } as any);
    });
  });
});

// End of unit tests for: add
