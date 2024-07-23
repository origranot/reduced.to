// Unit tests for: IsVerified

import { IS_VERFIED_KEY, IsVerified } from '../is-verified.decorator';

describe('IsVerified() IsVerified method', () => {
  // Happy Path Tests
  describe('Happy Path', () => {
    it('should set metadata with IS_VERFIED_KEY to true', () => {
      // Arrange
      const target = {};
      const key = IS_VERFIED_KEY;
      const value = true;

      // Act
      IsVerified()(target, key, value);

      // Assert
      expect(target[key]).toBe(value);
    });

    it('should not overwrite existing metadata', () => {
      // Arrange
      const target = {};
      const key = IS_VERFIED_KEY;
      const initialValue = false;
      target[key] = initialValue;

      // Act
      IsVerified()(target, key, true);

      // Assert
      expect(target[key]).toBe(initialValue); // Should remain unchanged
    });
  });

  // Edge Case Tests
  describe('Edge Cases', () => {
    it('should handle undefined target gracefully', () => {
      // Arrange
      const target = undefined;
      const key = IS_VERFIED_KEY;
      const value = true;

      // Act & Assert
      expect(() => IsVerified()(target, key, value)).toThrow();
    });

    it('should handle null target gracefully', () => {
      // Arrange
      const target = null;
      const key = IS_VERFIED_KEY;
      const value = true;

      // Act & Assert
      expect(() => IsVerified()(target, key, value)).toThrow();
    });

    it('should handle non-object target gracefully', () => {
      // Arrange
      const target = 123; // Non-object
      const key = IS_VERFIED_KEY;
      const value = true;

      // Act & Assert
      expect(() => IsVerified()(target, key, value)).toThrow();
    });
  });
});

// End of unit tests for: IsVerified
