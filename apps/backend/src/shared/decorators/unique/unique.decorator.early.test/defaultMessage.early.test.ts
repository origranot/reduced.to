// Unit tests for: defaultMessage

import { ValidationArguments } from 'class-validator';

import { UniqueConstraint } from '../unique.decorator';

// Mocking ValidationArguments
interface MockValidationArguments extends ValidationArguments {
  property: string;
  constraints: string[];
}

// Mocking PrismaService
class MockPrismaService {
  // Mocking the findUnique method
  findUnique = jest.fn();
}

// Test suite for UniqueConstraint's defaultMessage method
describe('UniqueConstraint.defaultMessage() defaultMessage method', () => {
  let uniqueConstraint: UniqueConstraint;
  let mockPrismaService: MockPrismaService;

  beforeEach(() => {
    mockPrismaService = new MockPrismaService() as any;
    uniqueConstraint = new UniqueConstraint(mockPrismaService as any);
  });

  // Happy path tests
  describe('Happy Path', () => {
    it('should return a default message indicating the property already exists', () => {
      // Arrange
      const args: MockValidationArguments = {
        property: 'email',
        constraints: ['User'],
      } as any;

      // Act
      const message = uniqueConstraint.defaultMessage(args);

      // Assert
      expect(message).toBe('email already exists!');
    });

    it('should return a default message for a different property', () => {
      // Arrange
      const args: MockValidationArguments = {
        property: 'username',
        constraints: ['User'],
      } as any;

      // Act
      const message = uniqueConstraint.defaultMessage(args);

      // Assert
      expect(message).toBe('username already exists!');
    });
  });

  // Edge cases tests
  describe('Edge Cases', () => {
    it('should handle an empty property gracefully', () => {
      // Arrange
      const args: MockValidationArguments = {
        property: '',
        constraints: ['User'],
      } as any;

      // Act
      const message = uniqueConstraint.defaultMessage(args);

      // Assert
      expect(message).toBe(' already exists!'); // Note the space before 'already'
    });

    it('should handle a property with special characters', () => {
      // Arrange
      const args: MockValidationArguments = {
        property: 'user@name!',
        constraints: ['User'],
      } as any;

      // Act
      const message = uniqueConstraint.defaultMessage(args);

      // Assert
      expect(message).toBe('user@name! already exists!');
    });

    it('should handle a property that is a number', () => {
      // Arrange
      const args: MockValidationArguments = {
        property: '12345',
        constraints: ['User'],
      } as any;

      // Act
      const message = uniqueConstraint.defaultMessage(args);

      // Assert
      expect(message).toBe('12345 already exists!');
    });

    it('should handle a property that is null', () => {
      // Arrange
      const args: MockValidationArguments = {
        property: null,
        constraints: ['User'],
      } as any;

      // Act
      const message = uniqueConstraint.defaultMessage(args);

      // Assert
      expect(message).toBe('null already exists!'); // Note the string representation of null
    });
  });
});

// End of unit tests for: defaultMessage
