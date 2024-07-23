// Unit tests for: calculateDateFromTtl

import { calculateDateFromTtl } from '../ttl';

describe('calculateDateFromTtl() calculateDateFromTtl method', () => {
  // Happy Path Tests
  describe('Happy Path', () => {
    it('should return a date that is ttl milliseconds in the future', () => {
      // Arrange
      const ttl = 10000; // 10 seconds
      const currentDate = new Date();
      const expectedDate = new Date(currentDate.getTime() + ttl);

      // Act
      const result = calculateDateFromTtl(ttl);

      // Assert
      expect(result.getTime()).toBeCloseTo(expectedDate.getTime(), -1); // Allow for minor discrepancies
    });

    it('should return a date that is 0 milliseconds in the future when ttl is 0', () => {
      // Arrange
      const ttl = 0;
      const currentDate = new Date();

      // Act
      const result = calculateDateFromTtl(ttl);

      // Assert
      expect(result.getTime()).toBeCloseTo(currentDate.getTime(), -1); // Allow for minor discrepancies
    });

    it('should return a date that is a large positive ttl in the future', () => {
      // Arrange
      const ttl = 31536000000; // 1 year in milliseconds
      const currentDate = new Date();
      const expectedDate = new Date(currentDate.getTime() + ttl);

      // Act
      const result = calculateDateFromTtl(ttl);

      // Assert
      expect(result.getTime()).toBeCloseTo(expectedDate.getTime(), -1); // Allow for minor discrepancies
    });
  });

  // Edge Case Tests
  describe('Edge Cases', () => {
    it('should handle negative ttl values correctly', () => {
      // Arrange
      const ttl = -10000; // -10 seconds
      const currentDate = new Date();
      const expectedDate = new Date(currentDate.getTime() + ttl);

      // Act
      const result = calculateDateFromTtl(ttl);

      // Assert
      expect(result.getTime()).toBeCloseTo(expectedDate.getTime(), -1); // Allow for minor discrepancies
    });

    it('should handle very large negative ttl values', () => {
      // Arrange
      const ttl = -31536000000; // -1 year in milliseconds
      const currentDate = new Date();
      const expectedDate = new Date(currentDate.getTime() + ttl);

      // Act
      const result = calculateDateFromTtl(ttl);

      // Assert
      expect(result.getTime()).toBeCloseTo(expectedDate.getTime(), -1); // Allow for minor discrepancies
    });

    it('should return a valid date object even for extreme ttl values', () => {
      // Arrange
      const ttl = Number.MAX_SAFE_INTEGER; // Maximum safe integer
      const currentDate = new Date();
      const expectedDate = new Date(currentDate.getTime() + ttl);

      // Act
      const result = calculateDateFromTtl(ttl);

      // Assert
      expect(result.getTime()).toBeCloseTo(expectedDate.getTime(), -1); // Allow for minor discrepancies
    });
  });
});

// End of unit tests for: calculateDateFromTtl
