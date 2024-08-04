// Unit tests for: defaultMessage

import { SortableConstraint } from '../sortable.decorator';

// Mocking ValidationArguments
interface MockValidationArguments {
  property: string;
  constraints: any[];
  targetName: string;
  value: any;
}

describe('SortableConstraint.defaultMessage() defaultMessage method', () => {
  let sortableConstraint: SortableConstraint;

  beforeEach(() => {
    sortableConstraint = new SortableConstraint();
  });

  describe('Happy Path', () => {
    it('should return a default message indicating the property already exists', () => {
      // Arrange
      const mockArgs: MockValidationArguments = {
        property: 'name',
        constraints: [],
        targetName: 'TestEntity',
        value: null,
      };

      // Act
      const result = sortableConstraint.defaultMessage(mockArgs as any);

      // Assert
      expect(result).toBe('name already exists!');
    });
  });

  describe('Edge Cases', () => {
    it('should handle an empty property gracefully', () => {
      // Arrange
      const mockArgs: MockValidationArguments = {
        property: '',
        constraints: [],
        targetName: 'TestEntity',
        value: null,
      };

      // Act
      const result = sortableConstraint.defaultMessage(mockArgs as any);

      // Assert
      expect(result).toBe(' already exists!');
    });

    it('should handle a property with special characters', () => {
      // Arrange
      const mockArgs: MockValidationArguments = {
        property: 'name@123',
        constraints: [],
        targetName: 'TestEntity',
        value: null,
      };

      // Act
      const result = sortableConstraint.defaultMessage(mockArgs as any);

      // Assert
      expect(result).toBe('name@123 already exists!');
    });

    it('should handle a property with spaces', () => {
      // Arrange
      const mockArgs: MockValidationArguments = {
        property: 'name with spaces',
        constraints: [],
        targetName: 'TestEntity',
        value: null,
      };

      // Act
      const result = sortableConstraint.defaultMessage(mockArgs as any);

      // Assert
      expect(result).toBe('name with spaces already exists!');
    });
  });
});

// End of unit tests for: defaultMessage
