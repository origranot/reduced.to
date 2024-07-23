// Unit tests for: canActivate

import { ExecutionContext, UnauthorizedException } from '@nestjs/common';

import { Reflector } from '@nestjs/core';

import { IsVerifiedGuard } from '../is-verified.guard';

describe('IsVerifiedGuard.canActivate() canActivate method', () => {
  let guard: IsVerifiedGuard;
  let reflector: Reflector;

  beforeEach(() => {
    reflector = new Reflector();
    guard = new IsVerifiedGuard(reflector);
  });

  describe('canActivate', () => {
    it('should allow access if isVerified is not set', () => {
      // Arrange
      const context = {
        getHandler: jest.fn().mockReturnValue(null),
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue({ user: { verified: true } }),
        }),
      } as unknown as ExecutionContext;

      // Act
      const result = guard.canActivate(context);

      // Assert
      expect(result).toBe(true);
    });

    it('should allow access if user is verified', () => {
      // Arrange
      reflector.get = jest.fn().mockReturnValue(true);
      const context = {
        getHandler: jest.fn().mockReturnValue(null),
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue({ user: { verified: true } }),
        }),
      } as unknown as ExecutionContext;

      // Act
      const result = guard.canActivate(context);

      // Assert
      expect(result).toBe(true);
    });

    it('should throw UnauthorizedException if user is not verified', () => {
      // Arrange
      reflector.get = jest.fn().mockReturnValue(true);
      const context = {
        getHandler: jest.fn().mockReturnValue(null),
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue({ user: { verified: false } }),
        }),
      } as unknown as ExecutionContext;

      // Act & Assert
      expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if user is undefined', () => {
      // Arrange
      reflector.get = jest.fn().mockReturnValue(true);
      const context = {
        getHandler: jest.fn().mockReturnValue(null),
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue({ user: undefined }),
        }),
      } as unknown as ExecutionContext;

      // Act & Assert
      expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
    });

    it('should allow access if user is not present and isVerified is true', () => {
      // Arrange
      reflector.get = jest.fn().mockReturnValue(true);
      const context = {
        getHandler: jest.fn().mockReturnValue(null),
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue({ user: null }),
        }),
      } as unknown as ExecutionContext;

      // Act
      const result = guard.canActivate(context);

      // Assert
      expect(result).toBe(true);
    });
  });
});

// End of unit tests for: canActivate
