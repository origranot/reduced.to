// Unit tests for: uploadImage

import { PutObjectCommandInput } from '@aws-sdk/client-s3';

import { StorageService } from '../storage.service';

class MockS3 {
  public putObject = jest.fn();
  public deleteObject = jest.fn();
  public headObject = jest.fn();
}

class MockAppConfigService {
  public getConfig = jest.fn().mockReturnValue({
    storage: {
      bucket: 'test-bucket',
      enable: true,
    },
  });
}

class MockAppLoggerService {
  public error = jest.fn();
}

describe('StorageService.uploadImage() uploadImage method', () => {
  let service: StorageService;
  let mockS3: MockS3;
  let mockConfig: MockAppConfigService;
  let mockLogger: MockAppLoggerService;

  beforeEach(() => {
    mockS3 = new MockS3();
    mockConfig = new MockAppConfigService();
    mockLogger = new MockAppLoggerService();
    service = new StorageService(mockS3 as any, mockConfig as any, mockLogger as any);
  });

  describe('uploadImage', () => {
    it('should upload an image successfully', async () => {
      // Arrange
      const name = 'test-image.png';
      const file = Buffer.from('test image data');
      const contentType = 'image/png';
      mockS3.putObject.mockResolvedValue({} as any); // Mock successful upload

      // Act
      const result = await service.uploadImage({ name, file, contentType });

      // Assert
      expect(mockS3.putObject).toHaveBeenCalledWith({
        Bucket: 'test-bucket',
        Key: name,
        Body: file,
        ACL: 'public-read',
        ContentType: contentType,
      } as PutObjectCommandInput);
      expect(result).toEqual({} as any); // Expecting the resolved value
    });

    it('should handle missing content type', async () => {
      // Arrange
      const name = 'test-image.png';
      const file = Buffer.from('test image data');
      mockS3.putObject.mockResolvedValue({} as any); // Mock successful upload

      // Act
      const result = await service.uploadImage({ name, file });

      // Assert
      expect(mockS3.putObject).toHaveBeenCalledWith({
        Bucket: 'test-bucket',
        Key: name,
        Body: file,
        ACL: 'public-read',
      } as PutObjectCommandInput);
      expect(result).toEqual({} as any); // Expecting the resolved value
    });

    it('should log an error if upload fails', async () => {
      // Arrange
      const name = 'test-image.png';
      const file = Buffer.from('test image data');
      const errorMessage = 'Upload failed';
      mockS3.putObject.mockRejectedValue(new Error(errorMessage)); // Mock upload failure

      // Act
      await service.uploadImage({ name, file });

      // Assert
      expect(mockLogger.error).toHaveBeenCalledWith('Error uploading image', expect.any(Error));
    });
  });

  describe('uploadImageFromUrl', () => {
    it('should upload an image from a URL successfully', async () => {
      // Arrange
      const imageUrl = 'http://example.com/image.png';
      const name = 'test-image.png';
      const mockFetch = jest.fn().mockResolvedValue({
        ok: true,
        arrayBuffer: jest.fn().mockResolvedValue(new Uint8Array([1, 2, 3]).buffer),
        headers: {
          get: jest.fn().mockReturnValue('image/png'),
        },
      });
      global.fetch = mockFetch as any; // Mock global fetch

      // Act
      const result = await service.uploadImageFromUrl(imageUrl, name);

      // Assert
      expect(mockFetch).toHaveBeenCalledWith(imageUrl);
      expect(mockS3.putObject).toHaveBeenCalledWith({
        Bucket: 'test-bucket',
        Key: name,
        Body: expect.any(Buffer),
        ACL: 'public-read',
        ContentType: 'image/png',
      } as PutObjectCommandInput);
      expect(result).toEqual({} as any); // Expecting the resolved value
    });

    it('should handle fetch errors gracefully', async () => {
      // Arrange
      const imageUrl = 'http://example.com/image.png';
      const name = 'test-image.png';
      const mockFetch = jest.fn().mockResolvedValue({
        ok: false,
        statusText: 'Not Found',
      });
      global.fetch = mockFetch as any; // Mock global fetch

      // Act
      await service.uploadImageFromUrl(imageUrl, name);

      // Assert
      expect(mockLogger.error).toHaveBeenCalledWith('Error uploading image', expect.any(Error));
    });

    it('should handle arrayBuffer errors gracefully', async () => {
      // Arrange
      const imageUrl = 'http://example.com/image.png';
      const name = 'test-image.png';
      const mockFetch = jest.fn().mockResolvedValue({
        ok: true,
        arrayBuffer: jest.fn().mockRejectedValue(new Error('ArrayBuffer error')),
        headers: {
          get: jest.fn().mockReturnValue('image/png'),
        },
      });
      global.fetch = mockFetch as any; // Mock global fetch

      // Act
      await service.uploadImageFromUrl(imageUrl, name);

      // Assert
      expect(mockLogger.error).toHaveBeenCalledWith('Error uploading image', expect.any(Error));
    });
  });
});

// End of unit tests for: uploadImage
