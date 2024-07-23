// Unit tests for: isUrlReportable

import { ReportsService } from '../reports.service';

class MockAppConfigService {
  public getConfig = jest.fn().mockReturnValue({
    front: {
      domain: 'reduced.to',
    },
  });
}

class MockPrismaService {
  // Mock methods and properties as needed
}

describe('ReportsService.isUrlReportable() isUrlReportable method', () => {
  let reportsService: ReportsService;
  let mockAppConfigService: MockAppConfigService;
  let mockPrismaService: MockPrismaService;

  beforeEach(() => {
    mockAppConfigService = new MockAppConfigService();
    mockPrismaService = new MockPrismaService();
    reportsService = new ReportsService(mockAppConfigService as any, mockPrismaService as any);
  });

  describe('isUrlReportable', () => {
    it('should return true for a valid reportable URL', () => {
      // This test checks the happy path where the URL is valid.
      const url = 'https://reduced.to/some-valid-key';
      const result = reportsService.isUrlReportable(url);
      expect(result).toBe(true);
    });

    it('should return false for a URL with an invalid domain', () => {
      // This test checks that a URL with a different domain is not reportable.
      const url = 'https://not-reduced.to/some-valid-key';
      const result = reportsService.isUrlReportable(url);
      expect(result).toBe(false);
    });

    it('should return false for a URL with an invalid scheme', () => {
      // This test checks that a URL with an invalid scheme is not reportable.
      const url = 'ftp://reduced.to/some-valid-key';
      const result = reportsService.isUrlReportable(url);
      expect(result).toBe(false);
    });

    it('should return false for a URL without a path', () => {
      // This test checks that a URL without a path is not reportable.
      const url = 'https://reduced.to';
      const result = reportsService.isUrlReportable(url);
      expect(result).toBe(false);
    });

    it('should return false for a URL with an invalid path', () => {
      // This test checks that a URL with an invalid path is not reportable.
      const url = 'https://reduced.to/invalid path';
      const result = reportsService.isUrlReportable(url);
      expect(result).toBe(false);
    });

    it('should return false for an empty URL', () => {
      // This test checks that an empty URL is not reportable.
      const url = '';
      const result = reportsService.isUrlReportable(url);
      expect(result).toBe(false);
    });

    it('should return false for a URL with only a query string', () => {
      // This test checks that a URL with only a query string is not reportable.
      const url = 'https://reduced.to/?key=value';
      const result = reportsService.isUrlReportable(url);
      expect(result).toBe(false);
    });

    it('should return false for a URL with a fragment', () => {
      // This test checks that a URL with a fragment is not reportable.
      const url = 'https://reduced.to/some-valid-key#fragment';
      const result = reportsService.isUrlReportable(url);
      expect(result).toBe(false);
    });
  });
});

// End of unit tests for: isUrlReportable
