// Unit tests for: exists

import { StorageService } from '../storage.service';

class MockS3 {
  public headObject = jest.fn();
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

describe('StorageService.exists() exists method', () => {
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

  it('should return true if the object exists', async () => {
    // This test checks the happy path where the object exists.
    const objectName = 'existing-object';
    mockS3.headObject.mockResolvedValue({} as any); // Simulate successful headObject call

    const result = await service.exists(objectName);

    expect(result).toBe(true);
    expect(mockS3.headObject).toHaveBeenCalledWith({
      Bucket: 'test-bucket',
      Key: objectName,
    });
  });

  it('should return false if the object does not exist', async () => {
    // This test checks the case where the object does not exist.
    const objectName = 'non-existing-object';
    mockS3.headObject.mockRejectedValue(new Error('Not Found')); // Simulate headObject throwing an error

    const result = await service.exists(objectName);

    expect(result).toBe(false);
    expect(mockS3.headObject).toHaveBeenCalledWith({
      Bucket: 'test-bucket',
      Key: objectName,
    });
  });

  it('should return false if an unexpected error occurs', async () => {
    // This test checks how the method handles unexpected errors.
    const objectName = 'error-object';
    mockS3.headObject.mockRejectedValue(new Error('Some unexpected error')); // Simulate headObject throwing an unexpected error

    const result = await service.exists(objectName);

    expect(result).toBe(false);
    expect(mockS3.headObject).toHaveBeenCalledWith({
      Bucket: 'test-bucket',
      Key: objectName,
    });
    expect(mockLogger.error).toHaveBeenCalledWith('Error checking existence of object', expect.any(Error));
  });

  it('should handle empty object name gracefully', async () => {
    // This test checks how the method handles an empty string as the object name.
    const objectName = '';
    mockS3.headObject.mockRejectedValue(new Error('Invalid Key')); // Simulate headObject throwing an error for invalid key

    const result = await service.exists(objectName);

    expect(result).toBe(false);
    expect(mockS3.headObject).toHaveBeenCalledWith({
      Bucket: 'test-bucket',
      Key: objectName,
    });
  });

  it('should handle null object name gracefully', async () => {
    // This test checks how the method handles a null value as the object name.
    const objectName = null as any; // Cast to any to bypass TypeScript strict checks
    mockS3.headObject.mockRejectedValue(new Error('Invalid Key')); // Simulate headObject throwing an error for invalid key

    const result = await service.exists(objectName);

    expect(result).toBe(false);
    expect(mockS3.headObject).toHaveBeenCalledWith({
      Bucket: 'test-bucket',
      Key: objectName,
    });
  });
});

// End of unit tests for: exists
