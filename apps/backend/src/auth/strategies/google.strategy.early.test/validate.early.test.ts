// Unit tests for: validate

import { GoogleStrategy } from '../google.strategy';

type MockVerifyCallback = (error: Error | null, user?: any) => void;

class MockAppConfigService {
  public getConfig = jest.fn().mockReturnValue({
    front: { domain: 'localhost' },
    general: { env: 'development' },
    auth: {
      google: {
        clientId: 'mockClientId',
        clientSecret: 'mockClientSecret',
      },
    },
  });
}

class MockUsersService {
  // Add any necessary mock methods for UsersService if needed
}

describe('GoogleStrategy.validate() validate method', () => {
  let googleStrategy: GoogleStrategy;
  let mockAppConfigService: MockAppConfigService;
  let mockUsersService: MockUsersService;
  let mockVerifyCallback: MockVerifyCallback;

  beforeEach(() => {
    mockAppConfigService = new MockAppConfigService();
    mockUsersService = new MockUsersService();
    googleStrategy = new GoogleStrategy(mockAppConfigService as any, mockUsersService as any);
    mockVerifyCallback = jest.fn();
  });

  describe('validate', () => {
    it('should return user object when email is verified', async () => {
      // This test checks the happy path where the email is verified.
      const profile = {
        name: { givenName: 'John', familyName: 'Doe' },
        emails: [{ value: 'john.doe@example.com', verified: true }],
        photos: [{ value: 'http://example.com/photo.jpg' }],
        id: 'google-id-123',
      };

      await googleStrategy.validate('access-token', 'refresh-token', profile as any, mockVerifyCallback);

      expect(mockVerifyCallback).toHaveBeenCalledWith(null, {
        email: 'john.doe@example.com',
        fullName: 'John Doe',
        picture: 'http://example.com/photo.jpg',
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
        providerId: 'google-id-123',
      });
    });

    it('should return an error when email is not verified', async () => {
      // This test checks the edge case where the email is not verified.
      const profile = {
        name: { givenName: 'Jane', familyName: 'Doe' },
        emails: [{ value: 'jane.doe@example.com', verified: false }],
        photos: [{ value: 'http://example.com/photo.jpg' }],
        id: 'google-id-456',
      };

      await googleStrategy.validate('access-token', 'refresh-token', profile as any, mockVerifyCallback);

      expect(mockVerifyCallback).toHaveBeenCalledWith(new Error('Email is not verified'));
    });

    it('should handle missing family name gracefully', async () => {
      // This test checks the edge case where the family name is missing.
      const profile = {
        name: { givenName: 'Alice' },
        emails: [{ value: 'alice@example.com', verified: true }],
        photos: [{ value: 'http://example.com/photo.jpg' }],
        id: 'google-id-789',
      };

      await googleStrategy.validate('access-token', 'refresh-token', profile as any, mockVerifyCallback);

      expect(mockVerifyCallback).toHaveBeenCalledWith(null, {
        email: 'alice@example.com',
        fullName: 'Alice',
        picture: 'http://example.com/photo.jpg',
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
        providerId: 'google-id-789',
      });
    });

    it('should handle missing photos gracefully', async () => {
      // This test checks the edge case where the photos array is empty.
      const profile = {
        name: { givenName: 'Bob', familyName: 'Smith' },
        emails: [{ value: 'bob@example.com', verified: true }],
        photos: [],
        id: 'google-id-101',
      };

      await googleStrategy.validate('access-token', 'refresh-token', profile as any, mockVerifyCallback);

      expect(mockVerifyCallback).toHaveBeenCalledWith(null, {
        email: 'bob@example.com',
        fullName: 'Bob Smith',
        picture: undefined, // No picture provided
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
        providerId: 'google-id-101',
      });
    });
  });
});

// End of unit tests for: validate
