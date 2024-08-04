// Unit tests for: parseUa

import uap from 'ua-parser-js';

import { VisitsService } from '../visits.service';

class MockPrismaService {
  public visit = {
    create: jest.fn().mockResolvedValue({}),
  };

  public link = {
    update: jest.fn().mockResolvedValue({}),
  };

  public $transaction = jest.fn((callback) => callback(this));
}

describe('VisitsService.parseUa() parseUa method', () => {
  let service: VisitsService;
  let mockPrismaService: MockPrismaService;

  beforeEach(() => {
    mockPrismaService = new MockPrismaService() as any;
    service = new VisitsService(mockPrismaService as any);
  });

  describe('Happy Path', () => {
    it('should correctly parse a valid user agent string', async () => {
      const ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3';
      const expectedOutput = {
        browser: 'Chrome',
        os: 'Windows',
        device: 'Desktop',
      };

      jest.spyOn(uap, 'default').mockReturnValue({
        browser: { name: 'Chrome' },
        os: { name: 'Windows' },
        device: { type: undefined },
      } as any);

      const result = await service.parseUa(ua);
      expect(result).toEqual(expectedOutput);
    });

    it('should return "Desktop" for a user agent with an undefined device type', async () => {
      const ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3';

      jest.spyOn(uap, 'default').mockReturnValue({
        browser: { name: 'Chrome' },
        os: { name: 'Windows' },
        device: { type: undefined },
      } as any);

      const result = await service.parseUa(ua);
      expect(result.device).toBe('Desktop');
    });
  });

  describe('Edge Cases', () => {
    it('should handle a user agent string with no browser information', async () => {
      const ua = 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)';
      const expectedOutput = {
        browser: null,
        os: null,
        device: 'Desktop',
      };

      jest.spyOn(uap, 'default').mockReturnValue({
        browser: { name: undefined },
        os: { name: undefined },
        device: { type: undefined },
      } as any);

      const result = await service.parseUa(ua);
      expect(result).toEqual(expectedOutput);
    });

    it('should handle a user agent string with a mobile device', async () => {
      const ua =
        'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_1 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/10.0 Mobile/14E277 Safari/602.1';
      const expectedOutput = {
        browser: 'Mobile Safari',
        os: 'iOS',
        device: 'Mobile',
      };

      jest.spyOn(uap, 'default').mockReturnValue({
        browser: { name: 'Mobile Safari' },
        os: { name: 'iOS' },
        device: { type: 'mobile' },
      } as any);

      const result = await service.parseUa(ua);
      expect(result).toEqual(expectedOutput);
    });

    it('should return null for all fields if user agent is empty', async () => {
      const ua = '';
      const expectedOutput = {
        browser: null,
        os: null,
        device: 'Desktop',
      };

      jest.spyOn(uap, 'default').mockReturnValue({
        browser: { name: undefined },
        os: { name: undefined },
        device: { type: undefined },
      } as any);

      const result = await service.parseUa(ua);
      expect(result).toEqual(expectedOutput);
    });
  });
});

// End of unit tests for: parseUa
