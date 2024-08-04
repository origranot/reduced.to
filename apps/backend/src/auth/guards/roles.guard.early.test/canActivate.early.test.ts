// Unit tests for: canActivate

import { ExecutionContext, UnauthorizedException } from '@nestjs/common';

import { Reflector } from '@nestjs/core';

import { Role } from '@reduced.to/prisma';

import { RolesGuard } from '../roles.guard';

describe('RolesGuard.canActivate() canActivate method', () => {
  let rolesGuard: RolesGuard;
  let reflector: Reflector;

  beforeEach(() => {
    reflector = new Reflector();
    rolesGuard = new RolesGuard(reflector);
  });

  describe('canActivate', () => {

    it('should allow access if user role matches defined roles', () => {
      // Arrange
      const roles: Role[] = ['ADMIN'];
      reflector.get = jest.fn().mockReturnValue(roles);
      const context = {
        switchToHttp: () => ({
          getRequest: () => ({ user: { role: 'ADMIN' } }),
        }),
        getHandler: () => {},
      } as ExecutionContext;

      // Act
      const result = rolesGuard.canActivate(context);

      // Assert
      expect(result).toBe(true);
    });

    it('should deny access if user role does not match defined roles', () => {
      // Arrange
      const roles: Role[] = ['ADMIN'];
      reflector.get = jest.fn().mockReturnValue(roles);
      const context = {
        switchToHttp: () => ({
          getRequest: () => ({ user: { role: 'USER' } }),
        }),
        getHandler: () => {},
      } as ExecutionContext;

      // Act & Assert
      expect(() => rolesGuard.canActivate(context)).toThrow(UnauthorizedException);
    });

    it('should deny access if user is not defined', () => {
      // Arrange
      const roles: Role[] = ['ADMIN'];
      reflector.get = jest.fn().mockReturnValue(roles);
      const context = {
        switchToHttp: () => ({
          getRequest: () => ({ user: null }),
        }),
        getHandler: () => {},
      } as ExecutionContext;

      // Act & Assert
      expect(() => rolesGuard.canActivate(context)).toThrow(UnauthorizedException);
    });

    it('should deny access if roles are defined but user role is undefined', () => {
      // Arrange
      const roles: Role[] = ['ADMIN'];
      reflector.get = jest.fn().mockReturnValue(roles);
      const context = {
        switchToHttp: () => ({
          getRequest: () => ({ user: { role: undefined } }),
        }),
        getHandler: () => {},
      } as ExecutionContext;

      // Act & Assert
      expect(() => rolesGuard.canActivate(context)).toThrow(UnauthorizedException);
    });
  });
});

// End of unit tests for: canActivate
