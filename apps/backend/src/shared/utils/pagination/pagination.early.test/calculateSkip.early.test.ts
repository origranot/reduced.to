// Unit tests for: calculateSkip

import { calculateSkip } from '../pagination';

describe('calculateSkip() calculateSkip method', () => {
  // Happy Path Tests
  describe('Happy Path', () => {
    it('should return 0 when page is 1 and limit is 10', () => {
      // This test checks the first page with a limit of 10.
      const result = calculateSkip(1, 10);
      expect(result).toBe(0);
    });

    it('should return 10 when page is 2 and limit is 10', () => {
      // This test checks the second page with a limit of 10.
      const result = calculateSkip(2, 10);
      expect(result).toBe(10);
    });

    it('should return 20 when page is 3 and limit is 10', () => {
      // This test checks the third page with a limit of 10.
      const result = calculateSkip(3, 10);
      expect(result).toBe(20);
    });

    it('should return 0 when page is 1 and limit is 5', () => {
      // This test checks the first page with a limit of 5.
      const result = calculateSkip(1, 5);
      expect(result).toBe(0);
    });

    it('should return 5 when page is 2 and limit is 5', () => {
      // This test checks the second page with a limit of 5.
      const result = calculateSkip(2, 5);
      expect(result).toBe(5);
    });
  });

  // Edge Cases Tests
  describe('Edge Cases', () => {
    it('should return 0 when page is less than 1', () => {
      // This test checks that any page less than 1 returns 0.
      const result = calculateSkip(0, 10);
      expect(result).toBe(0);
    });

    it('should return 0 when page is negative', () => {
      // This test checks that a negative page returns 0.
      const result = calculateSkip(-1, 10);
      expect(result).toBe(0);
    });

    it('should return 0 when page is 0', () => {
      // This test checks that a page of 0 returns 0.
      const result = calculateSkip(0, 10);
      expect(result).toBe(0);
    });

    it('should return a large skip value for a large page number', () => {
      // This test checks the calculation for a large page number.
      const result = calculateSkip(1000, 10);
      expect(result).toBe(9900);
    });

    it('should return a large skip value for a large limit', () => {
      // This test checks the calculation for a large limit.
      const result = calculateSkip(10, 1000);
      expect(result).toBe(9000);
    });
  });
});

// End of unit tests for: calculateSkip
