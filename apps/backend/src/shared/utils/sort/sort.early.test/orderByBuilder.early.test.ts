// Unit tests for: orderByBuilder

import { SortOrder } from '../../../enums/sort-order.enum';

import { IOrderByResult, orderByBuilder } from '../sort';

describe('orderByBuilder() orderByBuilder method', () => {
  // Happy Path Tests
  it('should return an array of objects with correct sort order for a valid input', () => {
    // This test checks if the function correctly transforms a valid sort object.
    const sortInput = { name: SortOrder.ASCENDING, age: SortOrder.DESCENDING };
    const expectedOutput: IOrderByResult = [{ name: SortOrder.ASCENDING }, { age: SortOrder.DESCENDING }];

    const result = orderByBuilder(sortInput);
    expect(result).toEqual(expectedOutput);
  });

  it('should return an array with a single object for a single key input', () => {
    // This test checks if the function handles a single key correctly.
    const sortInput = { name: SortOrder.ASCENDING };
    const expectedOutput: IOrderByResult = [{ name: SortOrder.ASCENDING }];

    const result = orderByBuilder(sortInput);
    expect(result).toEqual(expectedOutput);
  });

  // Edge Case Tests
  it('should return undefined for an empty sort object', () => {
    // This test checks if the function returns undefined for an empty object.
    const sortInput = {};
    const result = orderByBuilder(sortInput);
    expect(result).toBeUndefined();
  });

  it('should return undefined for a null input', () => {
    // This test checks if the function returns undefined for a null input.
    const sortInput = null;
    const result = orderByBuilder(sortInput);
    expect(result).toBeUndefined();
  });

  it('should return undefined for an undefined input', () => {
    // This test checks if the function returns undefined for an undefined input.
    const sortInput = undefined;
    const result = orderByBuilder(sortInput);
    expect(result).toBeUndefined();
  });

  it('should handle a sort object with mixed keys and values', () => {
    // This test checks if the function can handle a sort object with mixed keys and values.
    const sortInput = { name: SortOrder.ASCENDING, age: SortOrder.DESCENDING, height: SortOrder.ASCENDING };
    const expectedOutput: IOrderByResult = [{ name: SortOrder.ASCENDING }, { age: SortOrder.DESCENDING }, { height: SortOrder.ASCENDING }];

    const result = orderByBuilder(sortInput);
    expect(result).toEqual(expectedOutput);
  });
});

// End of unit tests for: orderByBuilder
