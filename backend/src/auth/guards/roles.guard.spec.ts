import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolesGuard } from './roles.guard';
import { Role } from '@prisma/client';
import { UserContext } from '../interfaces/user-context';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: Reflector;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RolesGuard, Reflector],
    }).compile();

    guard = module.get<RolesGuard>(RolesGuard);
    reflector = module.get<Reflector>(Reflector);
  });

  it('should allow access if no roles are defined', () => {
    const context = createMockContext(undefined, undefined);

    const result = guard.canActivate(context);

    expect(result).toBe(true);
  });

  it('should allow access if user has the required role', () => {
    const userRole = Role.ADMIN;
    const roles = [userRole];
    const context = createMockContext(roles, userRole);

    const result = guard.canActivate(context);

    expect(result).toBe(true);
  });

  it('should allow access if user has one of the required role', () => {
    const userRole = Role.USER;
    const roles = [Role.ADMIN, userRole];
    const context = createMockContext(roles, userRole);

    const result = guard.canActivate(context);

    expect(result).toBe(true);
  });

  it('should deny access if user does not have the required role', () => {
    const userRole = Role.USER;
    const requiredRole = Role.ADMIN;
    const roles = [requiredRole];
    const context = createMockContext(roles, userRole);

    expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
  });

  it('should deny access if user does not have role at all and there is a defined roles', () => {
    const userRole = undefined;
    const requiredRole = Role.ADMIN;
    const roles = [requiredRole];
    const context = createMockContext(roles, userRole);

    expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
  });

  function createMockContext(roles: Role[], userRole: Role): ExecutionContext {
    const handler = jest.fn();
    const request = {
      user: { role: userRole } as UserContext,
    };
    const switchToHttpFn = jest.fn().mockReturnValue({
      getRequest: () => request,
    });
    const context = {
      getHandler: () => handler,
      switchToHttp: switchToHttpFn,
    } as unknown as ExecutionContext;

    jest.spyOn(reflector, 'get').mockReturnValue(roles);
    return context;
  }
});
