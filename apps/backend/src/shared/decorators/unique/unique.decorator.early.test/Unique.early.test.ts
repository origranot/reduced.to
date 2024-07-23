// Unit tests for: Unique

import { ValidationArguments } from 'class-validator';

import { UniqueConstraint } from '../unique.decorator';

// Mocking the PrismaService
class MockPrismaService {
  public user = {
    findUnique: jest.fn(),
  };
}

// Test Suite for Unique
describe('Unique() Unique method', () => {
  let uniqueConstraint: UniqueConstraint;
  let mockPrismaService: MockPrismaService;

  beforeEach(() => {
    mockPrismaService = new MockPrismaService();
    uniqueConstraint = new UniqueConstraint(mockPrismaService as any);
  });

  describe('Happy Path', () => {
    it('should return true if the value does not exist in the database', async () => {
      // Arrange
      const value = 'uniqueValue';
      const args: ValidationArguments = {
        constraints: ['user'],
        property: 'username',
        targetName: 'User',
        object: {},
        value,
      } as any;

      mockPrismaService.user.findUnique.mockResolvedValue(null);

      // Act
      const result = await uniqueConstraint.validate(value, args);

      // Assert
      expect(result).toBe(true);
    });

    it('should return false if the value exists in the database', async () => {
      // Arrange
      const value = 'existingValue';
      const args: ValidationArguments = {
        constraints: ['user'],
        property: 'username',
        targetName: 'User',
        object: {},
        value,
      } as any;

      mockPrismaService.user.findUnique.mockResolvedValue({ id: 1 });

      // Act
      const result = await uniqueConstraint.validate(value, args);

      // Assert
      expect(result).toBe(false);
    });

    it('should return false if no value is provided', async () => {
      // Arrange
      const args: ValidationArguments = {
        constraints: ['user'],
        property: 'username',
        targetName: 'User',
        object: {},
        value: null,
      } as any;

      // Act
      const result = await uniqueConstraint.validate(null, args);

      // Assert
      expect(result).toBe(false);
    });

    it('should throw an error if the model does not exist', async () => {
      // Arrange
      const value = 'someValue';
      const args: ValidationArguments = {
        constraints: ['nonExistentModel'],
        property: 'username',
        targetName: 'User',
        object: {},
        value,
      } as any;

      // Act & Assert
      await expect(uniqueConstraint.validate(value, args)).rejects.toThrow('Model nonExistentModel does not exist');
    });
  });

  describe('Edge Cases', () => {
    it('should return false if the model is not provided', async () => {
      // Arrange
      const value = 'someValue';
      const args: ValidationArguments = {
        constraints: [],
        property: 'username',
        targetName: 'User',
        object: {},
        value,
      } as any;

      // Act
      const result = await uniqueConstraint.validate(value, args);

      // Assert
      expect(result).toBe(false);
    });

    it('should handle unexpected value types gracefully', async () => {
      // Arrange
      const value = 12345; // unexpected type
      const args: ValidationArguments = {
        constraints: ['user'],
        property: 'username',
        targetName: 'User',
        object: {},
        value,
      } as any;

      mockPrismaService.user.findUnique.mockResolvedValue(null);

      // Act
      const result = await uniqueConstraint.validate(value, args);

      // Assert
      expect(result).toBe(true);
    });
  });
});

// End of unit tests for: Unique
