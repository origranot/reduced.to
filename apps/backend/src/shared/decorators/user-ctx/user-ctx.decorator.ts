import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const UserCtx = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return request.user;
});
