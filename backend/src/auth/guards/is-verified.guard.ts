import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_VERFIED_KEY } from '../../shared/decorators/is-verified/is-verified.decorator';
import { UserContext } from '../interfaces/user-context';

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
    console.log('user', user)

    if (!user.verified) {
      throw new UnauthorizedException();
    }

    return true;
  }
}
