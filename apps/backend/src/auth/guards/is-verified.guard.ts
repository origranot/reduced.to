import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_VERFIED_KEY } from '@rt/backend/shared/decorators/is-verified/is-verified.decorator';
import { UserContext } from '@rt/backend/auth/interfaces/user-context';

@Injectable()
export class IsVerifiedGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isVerified = this.reflector.get<boolean>(IS_VERFIED_KEY, context.getHandler());
    if (!isVerified) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user as UserContext;

    if (!user.verified) {
      throw new UnauthorizedException();
    }

    return true;
  }
}
