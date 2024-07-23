import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { UserContext } from '../auth/interfaces/user-context';
import { PLAN_LEVELS } from '@reduced.to/subscription-manager';

@Injectable()
export class RestrictDays implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user as UserContext;
    const plan = user.plan || 'FREE';
    const planConfig = PLAN_LEVELS[plan] || PLAN_LEVELS["FREE"];
    const maxDays = planConfig.FEATURES.ANALYTICS.value;
    const query = request.query;

    // Apply logic to modify the 'days' query parameter if it exists
    if (query.days) {
      const days = parseInt(query.days, 10);
      if (isNaN(days) || days < 0) {
        query.days = '0'; // Default to 0 if the value is invalid
      } else if (days > maxDays) {
        query.days = maxDays.toString();
      }
    }

    // Allow the request to proceed
    return true;
  }
}
