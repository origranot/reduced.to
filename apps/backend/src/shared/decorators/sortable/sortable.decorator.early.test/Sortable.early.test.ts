// Unit tests for: Sortable

import { BadRequestException } from '@nestjs/common';

import { ValidationArguments } from 'class-validator';

import { SortOrder } from '../../../enums/sort-order.enum';

import { SortableConstraint } from '../sortable.decorator';

class MockNestedObject {
  public name: string = 'Hi';
}

describe('Sortable() Sortable method', () => {
  let sortableConstraint: SortableConstraint;

  beforeEach(() => {
    sortableConstraint = new SortableConstraint();
  });

  describe('Happy Path', () => {
    it('should validate correctly when all fields are valid', async () => {
      const args: ValidationArguments = {
        constraints: ['name', 'age'],
        property: 'sort',
        targetName: 'Person',
        object: {},
        value: { name: SortOrder.ASCENDING, age: SortOrder.DESCENDING },
      } as any;

      const result = await sortableConstraint.validate(args.value, args);
      expect(result).toBe(true);
    });

    it('should validate correctly when value is undefined', async () => {
      const args: ValidationArguments = {
        constraints: ['name', 'age'],
        property: 'sort',
        targetName: 'Person',
        object: {},
        value: undefined,
      } as any;

      const result = await sortableConstraint.validate(args.value, args);
      expect(result).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    it('should throw BadRequestException for invalid sort field', async () => {
      const args: ValidationArguments = {
        constraints: ['name', 'age'],
        property: 'sort',
        targetName: 'Person',
        object: {},
        value: { invalidField: SortOrder.ASCENDING },
      } as any;

      await expect(sortableConstraint.validate(args.value, args)).rejects.toThrow(BadRequestException);
      await expect(sortableConstraint.validate(args.value, args)).rejects.toThrow('Invalid sort field: invalidField');
    });

    it('should throw BadRequestException for invalid sort order', async () => {
      const args: ValidationArguments = {
        constraints: ['name', 'age'],
        property: 'sort',
        targetName: 'Person',
        object: {},
        value: { name: 'invalidOrder' },
      } as any;

      await expect(sortableConstraint.validate(args.value, args)).rejects.toThrow(BadRequestException);
      await expect(sortableConstraint.validate(args.value, args)).rejects.toThrow('Invalid sort order: invalidOrder');
    });

    it('should throw BadRequestException for multiple invalid fields', async () => {
      const args: ValidationArguments = {
        constraints: ['name', 'age'],
        property: 'sort',
        targetName: 'Person',
        object: {},
        value: { invalidField: SortOrder.ASCENDING, anotherInvalid: SortOrder.DESCENDING },
      } as any;

      await expect(sortableConstraint.validate(args.value, args)).rejects.toThrow(BadRequestException);
      await expect(sortableConstraint.validate(args.value, args)).rejects.toThrow('Invalid sort field: invalidField');
    });
  });
});

// End of unit tests for: Sortable
