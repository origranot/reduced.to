// Unit tests for: Roles

import { SetMetadata } from '@nestjs/common';

import { Role } from '@reduced.to/prisma';

import { ROLES_KEY, Roles } from '../roles.decorator';

describe('Roles() Roles method', () => {
  // Happy Path Tests
  describe('Happy Path', () => {
    it('should set metadata with a single role', () => {
      // Arrange
      const role = Role.ADMIN;

      // Act
      const result = Roles(role);

      // Assert
      expect(SetMetadata).toHaveBeenCalledWith(ROLES_KEY, [role]);
      expect(result).toBeDefined();
    });

    it('should set metadata with multiple roles', () => {
      // Arrange
      const roles = [Role.ADMIN, Role.USER];

      // Act
      const result = Roles(...roles);

      // Assert
      expect(SetMetadata).toHaveBeenCalledWith(ROLES_KEY, roles);
      expect(result).toBeDefined();
    });
  });

  // Edge Cases Tests
  describe('Edge Cases', () => {
    it('should handle no roles provided', () => {
      // Act
      const result = Roles();

      // Assert
      expect(SetMetadata).toHaveBeenCalledWith(ROLES_KEY, []);
      expect(result).toBeDefined();
    });

    it('should handle undefined roles', () => {
      // Act
      const result = Roles(undefined);

      // Assert
      expect(SetMetadata).toHaveBeenCalledWith(ROLES_KEY, [undefined]);
      expect(result).toBeDefined();
    });

    it('should handle null roles', () => {
      // Act
      const result = Roles(null);

      // Assert
      expect(SetMetadata).toHaveBeenCalledWith(ROLES_KEY, [null]);
      expect(result).toBeDefined();
    });

    it('should handle an empty array of roles', () => {
      // Act
      const result = Roles(...[]);

      // Assert
      expect(SetMetadata).toHaveBeenCalledWith(ROLES_KEY, []);
      expect(result).toBeDefined();
    });
  });
});

// End of unit tests for: Roles
