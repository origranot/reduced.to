// Unit tests for: fetch

import { Metadata, MetadataService } from '../metadata.service';

import { MetadataController } from '../metadata.controller';

import { Test, TestingModule } from '@nestjs/testing';

describe('MetadataController.fetch() fetch method', () => {
  let controller: MetadataController;
  let service: MetadataService;

  const mockMetadataService = {
    fetch: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MetadataController],
      providers: [
        {
          provide: MetadataService,
          useValue: mockMetadataService,
        },
      ],
    }).compile();

    controller = module.get<MetadataController>(MetadataController);
    service = module.get<MetadataService>(MetadataService);
  });

  describe('fetch', () => {
    it('should return metadata for a valid URL', async () => {
      // This test checks the happy path where a valid URL is provided.
      const url = 'https://example.com';
      const expectedMetadata: Metadata = {
        title: 'Example Title',
        description: 'Example Description',
        image: 'https://example.com/image.png',
        url: url,
        hostname: 'example.com',
      };

      mockMetadataService.fetch.mockResolvedValue(expectedMetadata);

      const result = await controller.fetch(url);
      expect(result).toEqual(expectedMetadata);
      expect(service.fetch).toHaveBeenCalledWith(url);
    });

    it('should return empty metadata for an empty URL', async () => {
      // This test checks the edge case where an empty URL is provided.
      const url = '';
      const expectedMetadata: Metadata = {
        title: null,
        description: null,
        image: null,
        url: null,
        hostname: null,
      };

      mockMetadataService.fetch.mockResolvedValue(expectedMetadata);

      const result = await controller.fetch(url);
      expect(result).toEqual(expectedMetadata);
      expect(service.fetch).toHaveBeenCalledWith(url);
    });

    it('should return empty metadata for an invalid URL', async () => {
      // This test checks the edge case where an invalid URL is provided.
      const url = 'invalid-url';
      const expectedMetadata: Metadata = {
        title: null,
        description: null,
        image: null,
        url: null,
        hostname: null,
      };

      mockMetadataService.fetch.mockResolvedValue(expectedMetadata);

      const result = await controller.fetch(url);
      expect(result).toEqual(expectedMetadata);
      expect(service.fetch).toHaveBeenCalledWith(url);
    });

    it('should handle errors gracefully and return empty metadata', async () => {
      // This test checks the edge case where an error occurs during fetching.
      const url = 'https://example.com';
      mockMetadataService.fetch.mockRejectedValue(new Error('Fetch error'));

      const result = await controller.fetch(url);
      const expectedMetadata: Metadata = {
        title: null,
        description: null,
        image: null,
        url: null,
        hostname: null,
      };

      expect(result).toEqual(expectedMetadata);
      expect(service.fetch).toHaveBeenCalledWith(url);
    });
  });
});

// End of unit tests for: fetch
