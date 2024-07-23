// Unit tests for: validate

import { BadRequestException } from '@nestjs/common';

import { SortOrder } from '../../../enums/sort-order.enum';

import { SortableConstraint } from '../sortable.decorator';

interface MockValidationArguments {
  constraints: string[];
  property: string;
}

describe('SortableConstraint.validate() validate method', () => {
  let sortableConstraint: SortableConstraint;

  beforeEach(() => {
    sortableConstraint = new SortableConstraint();
  });

  // Happy Path Tests
  describe('Happy Path', () => {
    it('should return true for valid sort fields and orders', async () => {
      const mockArgs: MockValidationArguments = {
        constraints: ['name', 'age'],
        property: 'sort',
      };

      const value = {
        name: SortOrder.ASCENDING,
        age: SortOrder.DESCENDING,
      };

      const result = await sortableConstraint.validate(value, mockArgs as any);
      expect(result).toBe(true);
    });

    it('should return true when value is null or undefined', async () => {
      const mockArgs: MockValidationArguments = {
        constraints: ['name', 'age'],
        property: 'sort',
      };

      const resultNull = await sortableConstraint.validate(null, mockArgs as any);
      expect(resultNull).toBe(true);

      const resultUndefined = await sortableConstraint.validate(undefined, mockArgs as any);
      expect(resultUndefined).toBe(true);
    });
  });

  // Edge Cases Tests
  describe('Edge Cases', () => {
    it('should throw BadRequestException for invalid sort field', async () => {
      const mockArgs: MockValidationArguments = {
        constraints: ['name', 'age'],
        property: 'sort',
      };

      const value = {
        invalidField: SortOrder.ASCENDING,
      };

      await expect(sortableConstraint.validate(value, mockArgs as any)).rejects.toThrow(BadRequestException);
      await expect(sortableConstraint.validate(value, mockArgs as any)).rejects.toThrow('Invalid sort field: invalidField');
    });

    it('should throw BadRequestException for invalid sort order', async () => {
      const mockArgs: MockValidationArguments = {
        constraints: ['name', 'age'],
        property: 'sort',
      };

      const value = {
        name: 'invalidOrder',
      };

      await expect(sortableConstraint.validate(value, mockArgs as any)).rejects.toThrow(BadRequestException);
      await expect(sortableConstraint.validate(value, mockArgs as any)).rejects.toThrow('Invalid sort order: invalidOrder');
    });

    it('should throw BadRequestException for multiple invalid fields and orders', async () => {
      const mockArgs: MockValidationArguments = {
        constraints: ['name', 'age'],
        property: 'sort',
      };

      const value = {
        invalidField: SortOrder.ASCENDING,
        name: 'invalidOrder',
      };

      await expect(sortableConstraint.validate(value, mockArgs as any)).rejects.toThrow(BadRequestException);
      await expect(sortableConstraint.validate(value, mockArgs as any)).rejects.toThrow('Invalid sort field: invalidField');
    });
  });
});

// End of unit tests for: validate
