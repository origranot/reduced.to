// Unit tests for: capitalize

import { capitalize } from '../helpers';
// capitalize.test.ts

// capitalize.test.ts
describe('capitalize() capitalize method', () => {
  // Happy Path Tests
  it('should capitalize the first letter of a lowercase string', () => {
    // This test checks if the function correctly capitalizes a lowercase string.
    expect(capitalize('hello')).toBe('Hello');
  });

  it('should capitalize the first letter of a mixed case string', () => {
    // This test checks if the function correctly capitalizes the first letter of a mixed case string.
    expect(capitalize('hElLo')).toBe('HElLo');
  });

  it('should capitalize the first letter of an uppercase string', () => {
    // This test checks if the function correctly capitalizes the first letter of an already uppercase string.
    expect(capitalize('HELLO')).toBe('HELLO');
  });

  it('should capitalize the first letter of a string with leading spaces', () => {
    // This test checks if the function correctly capitalizes the first letter when there are leading spaces.
    expect(capitalize('  world')).toBe('  World');
  });

  it('should capitalize the first letter of a string with punctuation', () => {
    // This test checks if the function correctly capitalizes the first letter when there is punctuation at the start.
    expect(capitalize('.hello')).toBe('.Hello');
  });

  // Edge Case Tests
  it('should return an empty string when input is an empty string', () => {
    // This test checks if the function returns an empty string when the input is empty.
    expect(capitalize('')).toBe('');
  });

  it('should handle a single character string', () => {
    // This test checks if the function correctly capitalizes a single character string.
    expect(capitalize('a')).toBe('A');
    expect(capitalize('Z')).toBe('Z');
  });

  it('should handle strings with only spaces', () => {
    // This test checks if the function returns the same string when it consists only of spaces.
    expect(capitalize('   ')).toBe('   ');
  });

  it('should handle strings with special characters', () => {
    // This test checks if the function correctly capitalizes the first letter when the first character is a special character.
    expect(capitalize('@hello')).toBe('@Hello');
  });

  it('should handle strings with numbers', () => {
    // This test checks if the function correctly capitalizes the first letter when the first character is a number.
    expect(capitalize('1hello')).toBe('1Hello');
  });

  it('should not modify the rest of the string', () => {
    // This test checks if the function only modifies the first character and leaves the rest unchanged.
    expect(capitalize('hello world')).toBe('Hello world');
    expect(capitalize('123abc')).toBe('123abc');
  });
});

// End of unit tests for: capitalize
