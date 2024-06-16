import { UserContext } from '../../auth/interfaces/user-context';
import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Role } from '@reduced.to/prisma';
import { FEATURES, PLAN_LEVELS } from '@reduced.to/subscription-manager';

export const GuardFields = createParamDecorator((_, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const user = request.user as UserContext;
  const body = request.body;
  const planName = user.plan || 'FREE';
  const plan = PLAN_LEVELS[planName];

  // Admins can do whatever the fuck they want
  if (user.role === Role.ADMIN || body.temporary) {
    return body;
  }

  const disabledFeatures = Object.keys(plan.FEATURES).filter((feature) => !plan.FEATURES[feature].enabled);
  for (const field in body) {
    const isNotPermitted = disabledFeatures.find((df) => {
      const apiGuard = FEATURES[df].apiGuard;
      if (!apiGuard) {
        return false;
      }

      return RegExp(apiGuard).test(field);
    });

    console.log(isNotPermitted);
    if (isNotPermitted) {
      throw new UnauthorizedException(`This feature is not available for your plan.`);
    }
  }

  return body;
});
