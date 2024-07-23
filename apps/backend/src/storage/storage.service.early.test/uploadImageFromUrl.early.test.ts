// Unit tests for: uploadImageFromUrl

import { StorageService } from '../storage.service';

class MockS3 {
  public putObject = jest.fn();
  public headObject = jest.fn();
  public deleteObject = jest.fn();
}

class MockAppConfigService {
  public getConfig = jest.fn().mockReturnValue({
    storage: {
      bucket: 'test-bucket',
    },
  });
}

class MockAppLoggerService {
  public error = jest.fn();
}

describe('StorageService.uploadImageFromUrl() uploadImageFromUrl method', () => {
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

  it('should upload an image successfully when the URL is valid', async () => {
    // Arrange
    const imageUrl = 'https://example.com/image.jpg';
    const name = 'image.jpg';
    const mockFetchResponse = {
      ok: true,
      arrayBuffer: jest.fn().mockResolvedValue(new Uint8Array([1, 2, 3]).buffer),
      headers: {
        get: jest.fn().mockReturnValue('image/jpeg'),
      },
    };
    global.fetch = jest.fn().mockResolvedValue(mockFetchResponse as any);

    mockS3.putObject.mockResolvedValue({ ETag: '12345' } as any);

    // Act
    const result = await service.uploadImageFromUrl(imageUrl, name);

    // Assert
    expect(fetch).toHaveBeenCalledWith(imageUrl);
    expect(mockS3.putObject).toHaveBeenCalledWith({
      Bucket: 'test-bucket',
      Key: name,
      Body: expect.any(Buffer),
      ACL: 'public-read',
      ContentType: 'image/jpeg',
    });
    expect(result).toEqual({ ETag: '12345' });
  });

  it('should log an error when the fetch fails', async () => {
    // Arrange
    const imageUrl = 'https://example.com/image.jpg';
    const name = 'image.jpg';
    const mockFetchResponse = {
      ok: false,
      statusText: 'Not Found',
    };
    global.fetch = jest.fn().mockResolvedValue(mockFetchResponse as any);

    // Act
    await service.uploadImageFromUrl(imageUrl, name);

    // Assert
    expect(mockLogger.error).toHaveBeenCalledWith('Error uploading image', expect.any(Error));
  });

  it('should log an error when the fetch throws an error', async () => {
    // Arrange
    const imageUrl = 'https://example.com/image.jpg';
    const name = 'image.jpg';
    global.fetch = jest.fn().mockRejectedValue(new Error('Network Error'));

    // Act
    await service.uploadImageFromUrl(imageUrl, name);

    // Assert
    expect(mockLogger.error).toHaveBeenCalledWith('Error uploading image', expect.any(Error));
  });

  it('should handle missing content type gracefully', async () => {
    // Arrange
    const imageUrl = 'https://example.com/image.jpg';
    const name = 'image.jpg';
    const mockFetchResponse = {
      ok: true,
      arrayBuffer: jest.fn().mockResolvedValue(new Uint8Array([1, 2, 3]).buffer),
      headers: {
        get: jest.fn().mockReturnValue(null), // No content type
      },
    };
    global.fetch = jest.fn().mockResolvedValue(mockFetchResponse as any);

    mockS3.putObject.mockResolvedValue({ ETag: '12345' } as any);

    // Act
    const result = await service.uploadImageFromUrl(imageUrl, name);

    // Assert
    expect(mockS3.putObject).toHaveBeenCalledWith({
      Bucket: 'test-bucket',
      Key: name,
      Body: expect.any(Buffer),
      ACL: 'public-read',
    });
    expect(result).toEqual({ ETag: '12345' });
  });
});

// End of unit tests for: uploadImageFromUrl
