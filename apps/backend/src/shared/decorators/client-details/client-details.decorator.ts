import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const ClientDetails = createParamDecorator((data: unknown, ctx: ExecutionContext): IClientDetails => {
  const request = ctx.switchToHttp().getRequest();
  const ip = (request.headers['x-forwarded-for'] || request.socket.remoteAddress) as string;
  const userAgent = request.headers['user-agent'];

  return {
    ip,
    userAgent,
  };
});

export interface IClientDetails {
  ip: string;
  userAgent: string | undefined;
}
