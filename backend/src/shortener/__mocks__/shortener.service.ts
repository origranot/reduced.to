export const ShortenerService = jest.fn().mockReturnValue({
  generateShortUrl: jest.fn(),
  isShortUrlAvailable: jest.fn(),
  addUrl: jest.fn(),
});
