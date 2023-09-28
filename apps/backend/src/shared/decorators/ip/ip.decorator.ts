import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Ip = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const ip = (request.headers['x-forwarded-for'] as string) || request.socket.remoteAddress;
  return ip;
});
