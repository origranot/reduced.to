// Unit tests for: getTracker

import { Request } from 'express';

import { CustomThrottlerGuard } from '../custom-throttler';

describe('CustomThrottlerGuard.getTracker() getTracker method', () => {
  let guard: CustomThrottlerGuard;

  beforeEach(() => {
    guard = new CustomThrottlerGuard();
  });

  describe('getTracker', () => {
    it('should return the IP address from x-forwarded-for header', () => {
      // This test aims to verify that the method correctly retrieves the IP from the x-forwarded-for header.
      const req = {
        headers: {
          'x-forwarded-for': '192.168.1.1',
        },
        socket: {
          remoteAddress: '127.0.0.1',
        },
      } as Request;

      const result = guard.getTracker(req);
      expect(result).toBe('192.168.1.1');
    });

    it('should return the IP address from socket.remoteAddress when x-forwarded-for is not present', () => {
      // This test aims to verify that the method correctly retrieves the IP from socket.remoteAddress when the x-forwarded-for header is absent.
      const req = {
        headers: {},
        socket: {
          remoteAddress: '127.0.0.1',
        },
      } as Request;

      const result = guard.getTracker(req);
      expect(result).toBe('127.0.0.1');
    });

    it('should return undefined if both x-forwarded-for and remoteAddress are not present', () => {
      // This test aims to verify that the method returns undefined when both x-forwarded-for and remoteAddress are absent.
      const req = {
        headers: {},
        socket: {
          remoteAddress: null,
        },
      } as Request;

      const result = guard.getTracker(req);
      expect(result).toBeUndefined();
    });

    it('should handle malformed x-forwarded-for header gracefully', () => {
      // This test aims to verify that the method handles a malformed x-forwarded-for header correctly.
      const req = {
        headers: {
          'x-forwarded-for': 'invalid-ip',
        },
        socket: {
          remoteAddress: '127.0.0.1',
        },
      } as Request;

      const result = guard.getTracker(req);
      expect(result).toBe('invalid-ip'); // Assuming we return whatever is in the header
    });

    it('should return the first IP in a comma-separated x-forwarded-for header', () => {
      // This test aims to verify that the method returns the first IP address from a comma-separated x-forwarded-for header.
      const req = {
        headers: {
          'x-forwarded-for': '192.168.1.1, 10.0.0.1',
        },
        socket: {
          remoteAddress: '127.0.0.1',
        },
      } as Request;

      const result = guard.getTracker(req);
      expect(result).toBe('192.168.1.1');
    });
  });
});

// End of unit tests for: getTracker
