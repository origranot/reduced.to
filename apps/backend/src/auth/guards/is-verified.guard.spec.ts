import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserContext } from '../interfaces/user-context';
import { IsVerifiedGuard } from './is-verified.guard';

describe('IsVerfied Guard', () => {
  let guard: IsVerifiedGuard;
  let reflector: Reflector;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IsVerifiedGuard, Reflector],
    }).compile();

    guard = module.get<IsVerifiedGuard>(IsVerifiedGuard);
    reflector = module.get<Reflector>(Reflector);
  });

  it('should allow access user is verified are defined', () => {
    const context = createMockContext(true);

    const result = guard.canActivate(context);

    expect(result).toBe(true);
  });

  it('should deny access if user is not verified', () => {
    const context = createMockContext(false);

    expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
  });

  function createMockContext(isVerified: boolean): ExecutionContext {
    const handler = jest.fn();
    const request = {
      user: { verified: isVerified } as UserContext,
    };
    const switchToHttpFn = jest.fn().mockReturnValue({
      getRequest: () => request,
    });
    const context = {
      getHandler: () => handler,
      switchToHttp: switchToHttpFn,
    } as unknown as ExecutionContext;

    jest.spyOn(reflector, 'get').mockReturnValue(true);
    return context;
  }
});
