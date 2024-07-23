// Unit tests for: sendVerificationEmail

import { Configuration } from '@reduced.to/config';

import { NovuService } from '../novu.service';

interface MockUserContext {
  id: string;
  email: string;
  name: string;
  verificationToken: string;
}

class MockNovu {
  trigger = jest.fn();
}

class MockAppConfigService {
  private config: Configuration = {
    general: {
      env: 'development',
      frontendPort: 3000,
    },
    front: {
      domain: 'localhost',
    },
  };

  getConfig = jest.fn().mockReturnValue(this.config);
}

describe('NovuService.sendVerificationEmail() sendVerificationEmail method', () => {
  let novuService: NovuService;
  let mockNovu: MockNovu;
  let mockAppConfigService: MockAppConfigService;

  beforeEach(() => {
    mockNovu = new MockNovu();
    mockAppConfigService = new MockAppConfigService();
    novuService = new NovuService(mockNovu as any, mockAppConfigService as any);
  });

  describe('sendVerificationEmail', () => {
    it('should send a verification email with the correct URL in development', async () => {
      // Arrange
      const user: MockUserContext = {
        id: 'user-id',
        email: 'user@example.com',
        name: 'John Doe',
        verificationToken: 'token123',
      };

      const expectedVerificationUrl = `http://localhost:3000/register/verify/${user.verificationToken}`;

      // Act
      await novuService.sendVerificationEmail(user);

      // Assert
      expect(mockNovu.trigger).toHaveBeenCalledWith('new-user', {
        to: {
          subscriberId: user.id,
          email: user.email,
        },
        payload: {
          name: user.name,
          verification_url: expectedVerificationUrl,
        },
      });
    });

    it('should send a verification email with the correct URL in production', async () => {
      // Arrange
      mockAppConfigService.getConfig.mockReturnValueOnce({
        general: {
          env: 'production',
          frontendPort: 3000,
        },
        front: {
          domain: 'example.com',
        },
      });

      const user: MockUserContext = {
        id: 'user-id',
        email: 'user@example.com',
        name: 'John Doe',
        verificationToken: 'token123',
      };

      const expectedVerificationUrl = `https://example.com/register/verify/${user.verificationToken}`;

      // Act
      await novuService.sendVerificationEmail(user);

      // Assert
      expect(mockNovu.trigger).toHaveBeenCalledWith('new-user', {
        to: {
          subscriberId: user.id,
          email: user.email,
        },
        payload: {
          name: user.name,
          verification_url: expectedVerificationUrl,
        },
      });
    });

    it('should handle errors when sending the email', async () => {
      // Arrange
      const user: MockUserContext = {
        id: 'user-id',
        email: 'user@example.com',
        name: 'John Doe',
        verificationToken: 'token123',
      };

      mockNovu.trigger.mockRejectedValue(new Error('Email service error'));

      // Act & Assert
      await expect(novuService.sendVerificationEmail(user)).rejects.toThrow('Email service error');
    });

    it('should handle missing user properties gracefully', async () => {
      // Arrange
      const user: MockUserContext = {
        id: 'user-id',
        email: '',
        name: 'John Doe',
        verificationToken: 'token123',
      };

      // Act
      await novuService.sendVerificationEmail(user);

      // Assert
      expect(mockNovu.trigger).toHaveBeenCalledWith('new-user', {
        to: {
          subscriberId: user.id,
          email: user.email,
        },
        payload: {
          name: user.name,
          verification_url: expect.any(String), // URL should still be generated
        },
      });
    });

    it('should throw an error if user is undefined', async () => {
      // Act & Assert
      await expect(novuService.sendVerificationEmail(undefined as any)).rejects.toThrow();
    });
  });
});

// End of unit tests for: sendVerificationEmail
