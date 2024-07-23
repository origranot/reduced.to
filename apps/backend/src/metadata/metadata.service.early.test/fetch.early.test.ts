// Unit tests for: fetch

import { parse } from 'node-html-parser';

import { MetadataService } from '../metadata.service';

jest.mock('node-html-parser', () => ({
  parse: jest.fn(),
}));

describe('MetadataService.fetch() fetch method', () => {
  let metadataService: MetadataService;

  beforeEach(() => {
    metadataService = new MetadataService();
  });

  // Happy Path Tests
  describe('Happy Path', () => {
    it('should return metadata with title, description, and image when valid URL is provided', async () => {
      // Arrange
      const urlString = 'http://example.com';
      const mockHtml = `
        <html>
          <head>
            <meta property="og:title" content="Example Title" />
            <meta name="description" content="Example Description" />
            <meta property="og:image" content="http://example.com/image.jpg" />
          </head>
        </html>
      `;
      (global.fetch as jest.Mock).mockResolvedValue({
        text: jest.fn().mockResolvedValue(mockHtml),
      });
      (parse as jest.Mock).mockReturnValue({
        querySelector: jest.fn((selector) => {
          const selectorsMap = {
            'meta[property="og:title"]': { getAttribute: () => 'Example Title' },
            'meta[name="description"]': { getAttribute: () => 'Example Description' },
            'meta[property="og:image"]': { getAttribute: () => 'http://example.com/image.jpg' },
            title: { text: 'Example Title' },
          };
          return selectorsMap[selector] || null;
        }),
      });

      // Act
      const result = await metadataService.fetch(urlString);

      // Assert
      expect(result).toEqual({
        title: 'Example Title',
        description: 'Example Description',
        image: 'http://example.com/image.jpg',
        url: urlString,
        hostname: 'example.com',
      });
    });

    it('should return metadata with only title when no description or image is present', async () => {
      // Arrange
      const urlString = 'http://example.com';
      const mockHtml = `
        <html>
          <head>
            <meta property="og:title" content="Only Title" />
          </head>
        </html>
      `;
      (global.fetch as jest.Mock).mockResolvedValue({
        text: jest.fn().mockResolvedValue(mockHtml),
      });
      (parse as jest.Mock).mockReturnValue({
        querySelector: jest.fn((selector) => {
          const selectorsMap = {
            'meta[property="og:title"]': { getAttribute: () => 'Only Title' },
            title: { text: 'Only Title' },
          };
          return selectorsMap[selector] || null;
        }),
      });

      // Act
      const result = await metadataService.fetch(urlString);

      // Assert
      expect(result).toEqual({
        title: 'Only Title',
        description: '',
        image: null,
        url: urlString,
        hostname: 'example.com',
      });
    });
  });

  // Edge Case Tests
  describe('Edge Cases', () => {
    it('should return empty metadata when an empty URL is provided', async () => {
      // Arrange
      const urlString = '';

      // Act
      const result = await metadataService.fetch(urlString);

      // Assert
      expect(result).toEqual({
        title: null,
        description: null,
        image: null,
        url: null,
        hostname: null,
      });
    });

    it('should return empty metadata when an invalid URL is provided', async () => {
      // Arrange
      const urlString = 'invalid-url';

      // Act
      const result = await metadataService.fetch(urlString);

      // Assert
      expect(result).toEqual({
        title: null,
        description: null,
        image: null,
        url: null,
        hostname: null,
      });
    });

    it('should return empty metadata when fetch fails', async () => {
      // Arrange
      const urlString = 'http://example.com';
      (global.fetch as jest.Mock).mockRejectedValue(new Error('Fetch failed'));

      // Act
      const result = await metadataService.fetch(urlString);

      // Assert
      expect(result).toEqual({
        title: null,
        description: null,
        image: null,
        url: null,
        hostname: null,
      });
    });

    it('should handle relative image URLs correctly', async () => {
      // Arrange
      const urlString = 'http://example.com';
      const mockHtml = `
        <html>
          <head>
            <meta property="og:image" content="/relative/image.jpg" />
          </head>
        </html>
      `;
      (global.fetch as jest.Mock).mockResolvedValue({
        text: jest.fn().mockResolvedValue(mockHtml),
      });
      (parse as jest.Mock).mockReturnValue({
        querySelector: jest.fn((selector) => {
          const selectorsMap = {
            'meta[property="og:image"]': { getAttribute: () => '/relative/image.jpg' },
          };
          return selectorsMap[selector] || null;
        }),
      });

      // Act
      const result = await metadataService.fetch(urlString);

      // Assert
      expect(result).toEqual({
        title: '',
        description: '',
        image: 'http://example.com/relative/image.jpg',
        url: urlString,
        hostname: 'example.com',
      });
    });
  });
});

// End of unit tests for: fetch
