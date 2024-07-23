// Unit tests for: isSafeUrl

import { GoogleSafeBrowsingChecker } from '../google-safe-browsing.checker';

import fetch from 'node-fetch';

jest.mock('node-fetch');
const { Response } = jest.requireActual('node-fetch');

describe('GoogleSafeBrowsingChecker.isSafeUrl() isSafeUrl method', () => {
  let checker: GoogleSafeBrowsingChecker;
  const apiKey = 'test-api-key';

  beforeEach(() => {
    checker = new GoogleSafeBrowsingChecker(apiKey);
  });

  describe('isSafeUrl', () => {
    it('should return true for a safe URL', async () => {
      // This test checks the happy path where the URL is safe.
      (fetch as jest.Mock).mockResolvedValueOnce(new Response(JSON.stringify({ matches: [] })));

      const result = await checker.isSafeUrl('https://example.com');
      expect(result).toBe(true);
    });

    it('should return false for a malicious URL', async () => {
      // This test checks the happy path where the URL is malicious.
      (fetch as jest.Mock).mockResolvedValueOnce(new Response(JSON.stringify({ matches: [{}] })));

      const result = await checker.isSafeUrl('https://malicious.com');
      expect(result).toBe(false);
    });

    it('should handle network errors gracefully', async () => {
      // This test checks how the method handles network errors.
      (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      await expect(checker.isSafeUrl('https://example.com')).rejects.toThrow('Network error');
    });

    it('should handle invalid JSON response', async () => {
      // This test checks how the method handles an invalid JSON response.
      (fetch as jest.Mock).mockResolvedValueOnce(new Response('Invalid JSON'));

      await expect(checker.isSafeUrl('https://example.com')).rejects.toThrow();
    });

    it('should return true for an empty response', async () => {
      // This test checks the case where the response is empty.
      (fetch as jest.Mock).mockResolvedValueOnce(new Response(JSON.stringify({})));

      const result = await checker.isSafeUrl('https://example.com');
      expect(result).toBe(true);
    });

    it('should return true for a URL with special characters', async () => {
      // This test checks the happy path for a URL with special characters.
      (fetch as jest.Mock).mockResolvedValueOnce(new Response(JSON.stringify({ matches: [] })));

      const result = await checker.isSafeUrl('https://example.com/?query=hello%20world');
      expect(result).toBe(true);
    });

    it('should return false for a URL with special characters that is malicious', async () => {
      // This test checks the case where a URL with special characters is malicious.
      (fetch as jest.Mock).mockResolvedValueOnce(new Response(JSON.stringify({ matches: [{}] })));

      const result = await checker.isSafeUrl('https://malicious.com/?query=hello%20world');
      expect(result).toBe(false);
    });
  });
});

// End of unit tests for: isSafeUrl
