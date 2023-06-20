import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserContext } from '../../../auth/interfaces/user-context';

export const User = createParamDecorator((data: keyof UserContext, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  if (data) {
    return request.user[data];
  }
  return request.user;
});
