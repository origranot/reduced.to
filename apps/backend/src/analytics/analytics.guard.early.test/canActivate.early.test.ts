import { ExecutionContext } from '@nestjs/common';
import { PLAN_LEVELS } from '@reduced.to/subscription-manager';
import { RestrictDays } from '../analytics.guard';

describe('RestrictDays.canActivate() canActivate method', () => {
  let restrictDays: RestrictDays;
  let mockExecutionContext: Partial<ExecutionContext>;

  beforeEach(() => {
    restrictDays = new RestrictDays();
    mockExecutionContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          user: {
            plan: 'FREE',
          },
          query: {},
        }),
      }),
    };
  });

  describe('Happy Path', () => {
    it('should allow the request to proceed when no days query parameter is provided', () => {
      const result = restrictDays.canActivate(mockExecutionContext as ExecutionContext);
      expect(result).toBe(true);
    });

    it('should set the days query parameter to the maxDays if it exceeds the plan limit', () => {
      const maxDays = PLAN_LEVELS['FREE'].FEATURES.ANALYTICS.value;
      mockExecutionContext.switchToHttp().getRequest().query.days = (maxDays + 1).toString();

      restrictDays.canActivate(mockExecutionContext as ExecutionContext);

      expect(mockExecutionContext.switchToHttp().getRequest().query.days).toBe(maxDays.toString());
    });

    it('should keep the days query parameter if it is within the plan limit', () => {
      const maxDays = PLAN_LEVELS['FREE'].FEATURES.ANALYTICS.value;
      mockExecutionContext.switchToHttp().getRequest().query.days = (maxDays - 1).toString();

      restrictDays.canActivate(mockExecutionContext as ExecutionContext);

      expect(mockExecutionContext.switchToHttp().getRequest().query.days).toBe((maxDays - 1).toString());
    });
  });

  describe('Edge Cases', () => {
    it('should default the days query parameter to 0 if it is negative', () => {
      mockExecutionContext.switchToHttp().getRequest().query.days = '-1';

      restrictDays.canActivate(mockExecutionContext as ExecutionContext);

      expect(mockExecutionContext.switchToHttp().getRequest().query.days).toBe('0');
    });

    it('should default the days query parameter to 0 if it is not a number', () => {
      mockExecutionContext.switchToHttp().getRequest().query.days = 'invalid';

      restrictDays.canActivate(mockExecutionContext as ExecutionContext);

      expect(mockExecutionContext.switchToHttp().getRequest().query.days).toBe('0');
    });

    it('should handle cases where the user has no plan and default to FREE', () => {
      delete mockExecutionContext.switchToHttp().getRequest().user.plan;
      const maxDays = PLAN_LEVELS['FREE'].FEATURES.ANALYTICS.value;
      mockExecutionContext.switchToHttp().getRequest().query.days = (maxDays + 1).toString();

      restrictDays.canActivate(mockExecutionContext as ExecutionContext);

      expect(mockExecutionContext.switchToHttp().getRequest().query.days).toBe(maxDays.toString());
    });

    it('should handle cases where the plan is not recognized and default to FREE', () => {
      mockExecutionContext.switchToHttp().getRequest().user.plan = 'UNKNOWN_PLAN';
      const maxDays = PLAN_LEVELS['FREE'].FEATURES.ANALYTICS.value;
      mockExecutionContext.switchToHttp().getRequest().query.days = (maxDays + 1).toString();

      restrictDays.canActivate(mockExecutionContext as ExecutionContext);

      expect(mockExecutionContext.switchToHttp().getRequest().query.days).toBe(maxDays.toString());
    });
  });
});
