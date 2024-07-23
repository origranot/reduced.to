// Unit tests for: delete

import { PROFILE_PICTURE_PREFIX, StorageService } from '../storage.service';

class MockS3 {
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

describe('StorageService.delete() delete method', () => {
  let storageService: StorageService;
  let mockS3: MockS3;
  let mockConfig: MockAppConfigService;
  let mockLogger: MockAppLoggerService;

  beforeEach(() => {
    mockS3 = new MockS3();
    mockConfig = new MockAppConfigService();
    mockLogger = new MockAppLoggerService();
    storageService = new StorageService(mockS3 as any, mockConfig as any, mockLogger as any);
  });

  describe('Happy Path', () => {
    it('should successfully delete an object from S3', async () => {
      // Arrange
      const objectName = `${PROFILE_PICTURE_PREFIX}/test-user-id`;
      mockS3.deleteObject.mockResolvedValue({} as any);

      // Act
      const result = await storageService.delete(objectName);

      // Assert
      expect(mockS3.deleteObject).toHaveBeenCalledWith({
        Bucket: 'test-bucket',
        Key: objectName,
      });
      expect(result).toEqual({} as any);
    });
  });

  describe('Edge Cases', () => {
    it('should handle errors when deleting an object', async () => {
      // Arrange
      const objectName = `${PROFILE_PICTURE_PREFIX}/test-user-id`;
      const errorMessage = 'Delete failed';
      mockS3.deleteObject.mockRejectedValue(new Error(errorMessage));

      // Act
      const result = storageService.delete(objectName);

      // Assert
      await expect(result).rejects.toThrow(errorMessage);
      expect(mockS3.deleteObject).toHaveBeenCalledWith({
        Bucket: 'test-bucket',
        Key: objectName,
      });
    });

    it('should handle empty object name gracefully', async () => {
      // Arrange
      const objectName = '';
      mockS3.deleteObject.mockResolvedValue({} as any);

      // Act
      const result = await storageService.delete(objectName);

      // Assert
      expect(mockS3.deleteObject).toHaveBeenCalledWith({
        Bucket: 'test-bucket',
        Key: objectName,
      });
      expect(result).toEqual({} as any);
    });

    it('should log an error if delete fails', async () => {
      // Arrange
      const objectName = `${PROFILE_PICTURE_PREFIX}/test-user-id`;
      const errorMessage = 'Delete failed';
      mockS3.deleteObject.mockRejectedValue(new Error(errorMessage));

      // Act
      await storageService.delete(objectName).catch(() => {});

      // Assert
      expect(mockLogger.error).toHaveBeenCalledWith('Error deleting object', expect.any(Error));
    });
  });
});

// End of unit tests for: delete
