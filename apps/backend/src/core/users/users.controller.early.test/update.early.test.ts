// Unit tests for: update

import { UpdateDto } from '../dto/update.dto';

import { PROFILE_PICTURE_PREFIX } from '../../../storage/storage.service';

import { UsersController } from '../users.controller';

interface MockUserContext {
  id: string;
  name: string;
}

class MockUsersService {
  updateById = jest.fn();
}

class MockAppConfigService {
  getConfig = jest.fn().mockReturnValue({ storage: { enable: true } });
}

class MockStorageService {
  uploadImage = jest.fn();
}

class MockAppLoggerService {
  error = jest.fn();
}

class MockAuthService {
  generateTokens = jest.fn();
}

describe('UsersController.update() update method', () => {
  let usersController: UsersController;
  let mockUsersService: MockUsersService;
  let mockAppConfigService: MockAppConfigService;
  let mockStorageService: MockStorageService;
  let mockAppLoggerService: MockAppLoggerService;
  let mockAuthService: MockAuthService;

  beforeEach(() => {
    mockUsersService = new MockUsersService();
    mockAppConfigService = new MockAppConfigService();
    mockStorageService = new MockStorageService();
    mockAppLoggerService = new MockAppLoggerService();
    mockAuthService = new MockAuthService();

    usersController = new UsersController(
      mockUsersService as any,
      mockAppConfigService as any,
      mockStorageService as any,
      mockAppLoggerService as any,
      mockAuthService as any
    );
  });

  describe('update', () => {
    const userContext: MockUserContext = { id: '123', name: 'John Doe' };

    it('should update displayName and return tokens', async () => {
      // Arrange
      const updateDto: UpdateDto = { displayName: 'Jane Doe' };
      const updatedUser = { id: '123', name: 'Jane Doe' };
      mockUsersService.updateById.mockResolvedValue(updatedUser);
      mockAuthService.generateTokens.mockResolvedValue({ accessToken: 'token' });

      // Act
      const result = await usersController.update(userContext as any, updateDto);

      // Assert
      expect(mockUsersService.updateById).toHaveBeenCalledWith(userContext.id, { name: updateDto.displayName });
      expect(mockAuthService.generateTokens).toHaveBeenCalledWith({ ...userContext, ...updatedUser });
      expect(result).toEqual({ accessToken: 'token' });
    });

    it('should upload profile picture if provided', async () => {
      // Arrange
      const updateDto: UpdateDto = {
        profilePicture: 'data:image/png;base64,abc123',
        displayName: ''
      };
      mockAuthService.generateTokens.mockResolvedValue({ accessToken: 'token' });

      // Act
      await usersController.update(userContext as any, updateDto);

      // Assert
      expect(mockStorageService.uploadImage).toHaveBeenCalledWith({
        name: `${PROFILE_PICTURE_PREFIX}/${userContext.id}`,
        file: expect.any(Buffer),
      });
    });

    it('should not upload profile picture if storage is disabled', async () => {
      // Arrange
      mockAppConfigService.getConfig.mockReturnValue({ storage: { enable: false } });
      const updateDto: UpdateDto = {
        profilePicture: 'data:image/png;base64,abc123',
        displayName: ''
      };

      // Act
      await usersController.update(userContext as any, updateDto);

      // Assert
      expect(mockStorageService.uploadImage).not.toHaveBeenCalled();
    });

    it('should handle errors during profile picture upload', async () => {
      // Arrange
      const updateDto: UpdateDto = {
        profilePicture: 'data:image/png;base64,abc123',
        displayName: ''
      };
      mockStorageService.uploadImage.mockRejectedValue(new Error('Upload failed'));
      mockAuthService.generateTokens.mockResolvedValue({ accessToken: 'token' });

      // Act
      await usersController.update(userContext as any, updateDto);

      // Assert
      expect(mockAppLoggerService.error).toHaveBeenCalledWith('Failed to upload profile picture.', expect.any(Error));
    });

    it('should not update if displayName is not provided', async () => {
      // Arrange
      const updateDto: UpdateDto = {
        displayName: ''
      };
      mockAuthService.generateTokens.mockResolvedValue({ accessToken: 'token' });

      // Act
      await usersController.update(userContext as any, updateDto);

      // Assert
      expect(mockUsersService.updateById).not.toHaveBeenCalled();
    });
  });
});

// End of unit tests for: update
