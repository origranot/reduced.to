// Unit tests for: validate

import { UniqueConstraint } from '../unique.decorator';

interface MockValidationArguments {
  constraints: string[];
  property: string;
}

class MockPrismaService {
  public [model: string]: any;

  constructor() {
    this.User = {
      findUnique: jest.fn(),
    };
  }
}

describe('UniqueConstraint.validate() validate method', () => {
  let uniqueConstraint: UniqueConstraint;
  let mockPrismaService: MockPrismaService;
  let mockValidationArguments: MockValidationArguments;

  beforeEach(() => {
    mockPrismaService = new MockPrismaService() as any;
    uniqueConstraint = new UniqueConstraint(mockPrismaService as any);
    mockValidationArguments = {
      constraints: ['User'],
      property: 'email',
    } as any;
  });

  describe('Happy Path', () => {
    it('should return true if the value does not exist in the database', async () => {
      // Arrange
      const value = 'test@example.com';
      mockPrismaService.User.findUnique.mockResolvedValue(null);

      // Act
      const result = await uniqueConstraint.validate(value, mockValidationArguments);

      // Assert
      expect(result).toBe(true);
      expect(mockPrismaService.User.findUnique).toHaveBeenCalledWith({
        where: {
          email: value,
        },
      });
    });

    it('should return false if the value exists in the database', async () => {
      // Arrange
      const value = 'test@example.com';
      mockPrismaService.User.findUnique.mockResolvedValue({ id: 1 });

      // Act
      const result = await uniqueConstraint.validate(value, mockValidationArguments);

      // Assert
      expect(result).toBe(false);
      expect(mockPrismaService.User.findUnique).toHaveBeenCalledWith({
        where: {
          email: value,
        },
      });
    });
  });

  describe('Edge Cases', () => {
    it('should return false if value is null', async () => {
      // Arrange
      const value = null;

      // Act
      const result = await uniqueConstraint.validate(value, mockValidationArguments);

      // Assert
      expect(result).toBe(false);
    });

    it('should return false if model is not provided', async () => {
      // Arrange
      const value = 'test@example.com';
      mockValidationArguments.constraints = []; // No model provided

      // Act
      const result = await uniqueConstraint.validate(value, mockValidationArguments);

      // Assert
      expect(result).toBe(false);
    });

    it('should throw an error if the model does not exist in PrismaService', async () => {
      // Arrange
      const value = 'test@example.com';
      mockValidationArguments.constraints = ['NonExistentModel'];

      // Act & Assert
      await expect(uniqueConstraint.validate(value, mockValidationArguments)).rejects.toThrow('Model NonExistentModel does not exist');
    });

    it('should handle unexpected errors gracefully', async () => {
      // Arrange
      const value = 'test@example.com';
      mockPrismaService.User.findUnique.mockRejectedValue(new Error('Database error'));

      // Act & Assert
      await expect(uniqueConstraint.validate(value, mockValidationArguments)).rejects.toThrow('Database error');
    });
  });
});

// End of unit tests for: validate
