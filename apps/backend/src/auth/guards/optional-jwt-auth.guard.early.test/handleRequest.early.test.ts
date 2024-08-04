// Unit tests for: handleRequest

import { OptionalJwtAuthGuard } from '../optional-jwt-auth.guard';

describe('OptionalJwtAuthGuard.handleRequest() handleRequest method', () => {
  let guard: OptionalJwtAuthGuard;

  beforeEach(() => {
    guard = new OptionalJwtAuthGuard();
  });

  describe('handleRequest', () => {
    // Happy Path Tests
    it('should return the user when a valid user object is provided', () => {
      // Arrange
      const user = { id: 1, name: 'John Doe' };
      const err = null;

      // Act
      const result = guard.handleRequest(err, user);

      // Assert
      expect(result).toEqual(user);
    });

    it('should return undefined when user is not provided', () => {
      // Arrange
      const user = undefined;
      const err = null;

      // Act
      const result = guard.handleRequest(err, user);

      // Assert
      expect(result).toBeUndefined();
    });

    // Edge Case Tests
    it('should return null when user is explicitly set to null', () => {
      // Arrange
      const user = null;
      const err = null;

      // Act
      const result = guard.handleRequest(err, user);

      // Assert
      expect(result).toBeNull();
    });

    it('should return the user when an error is provided but user is valid', () => {
      // Arrange
      const user = { id: 2, name: 'Jane Doe' };
      const err = new Error('Some error occurred');

      // Act
      const result = guard.handleRequest(err, user);

      // Assert
      expect(result).toEqual(user);
    });

    it('should return undefined when both error and user are undefined', () => {
      // Arrange
      const user = undefined;
      const err = undefined;

      // Act
      const result = guard.handleRequest(err, user);

      // Assert
      expect(result).toBeUndefined();
    });

    it('should return an empty object when user is an empty object', () => {
      // Arrange
      const user = {};
      const err = null;

      // Act
      const result = guard.handleRequest(err, user);

      // Assert
      expect(result).toEqual({});
    });
  });
});

// End of unit tests for: handleRequest
