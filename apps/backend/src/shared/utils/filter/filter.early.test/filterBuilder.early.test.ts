// Unit tests for: filterBuilder

import { filterBuilder } from '../filter';

// Mock classes
class MockNestedObject {
  public name = 'Hi';
}

class MockPerson {
  public age = 5;
  public nestedObjectProperty: MockNestedObject = new MockNestedObject();
}

describe('filterBuilder() filterBuilder method', () => {
  // Happy Path Tests
  describe('Happy Path', () => {
    it('should return an array with a filter when a boolean field is true', () => {
      // This test checks if the function correctly identifies a boolean field and returns the expected filter.
      const fields = { isActive: true };
      const filter = 'active';
      const result = filterBuilder(fields, filter);
      expect(result).toEqual([{ isActive: { contains: 'active' } }]);
    });

    it('should return nested filters when nested objects are provided', () => {
      // This test checks if the function correctly processes nested objects.
      const fields = { person: new MockPerson() };
      const filter = 'name';
      const result = filterBuilder(fields, filter);
      expect(result).toEqual([{ person: { name: { contains: 'name' } } }]);
    });

    it('should return multiple filters for multiple boolean fields', () => {
      // This test checks if the function can handle multiple boolean fields.
      const fields = { isActive: true, isVerified: true };
      const filter = 'status';
      const result = filterBuilder(fields, filter);
      expect(result).toEqual([{ isActive: { contains: 'status' } }, { isVerified: { contains: 'status' } }]);
    });
  });

  // Edge Cases Tests
  describe('Edge Cases', () => {
    it('should return undefined if fields are empty', () => {
      // This test checks if the function returns undefined for empty fields.
      const fields = {};
      const filter = 'test';
      const result = filterBuilder(fields, filter);
      expect(result).toBeUndefined();
    });

    it('should return undefined if filter is empty', () => {
      // This test checks if the function returns undefined for an empty filter.
      const fields = { isActive: true };
      const filter = '';
      const result = filterBuilder(fields, filter);
      expect(result).toBeUndefined();
    });

    it('should return undefined if fields are null', () => {
      // This test checks if the function returns undefined for null fields.
      const fields = null;
      const filter = 'test';
      const result = filterBuilder(fields, filter);
      expect(result).toBeUndefined();
    });

    it('should return undefined if fields are undefined', () => {
      // This test checks if the function returns undefined for undefined fields.
      const fields = undefined;
      const filter = 'test';
      const result = filterBuilder(fields, filter);
      expect(result).toBeUndefined();
    });

    it('should handle nested objects with no boolean fields', () => {
      // This test checks if the function returns undefined when there are no boolean fields in nested objects.
      const fields = { person: { name: 'John' } };
      const filter = 'name';
      const result = filterBuilder(fields, filter);
      expect(result).toBeUndefined();
    });

    it('should return undefined if no filters match', () => {
      // This test checks if the function returns undefined when no filters match.
      const fields = { isActive: false };
      const filter = 'inactive';
      const result = filterBuilder(fields, filter);
      expect(result).toBeUndefined();
    });
  });
});

// End of unit tests for: filterBuilder
