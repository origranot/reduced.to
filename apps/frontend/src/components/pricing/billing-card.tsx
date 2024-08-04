import { component$ } from '@builder.io/qwik';
import { LuCheck } from '@qwikest/icons/lucide';
import { PLAN_LEVELS, FEATURES, Plan } from '@reduced.to/subscription-manager';

interface BillingCardProps {
  isPrefferedPlan: boolean;
  billing: 'yearly' | 'monthly';
  plan: Plan;
  buttonText?: string;
  clickHandler?: (plan: Plan, id?: string) => void;
  href?: string;
}

export const BillingCard = component$(
  ({ plan, isPrefferedPlan, billing, href, buttonText = 'Get Started', clickHandler }: BillingCardProps) => {
    return (
      <div
        class={`relative flex flex-col text-center rounded-xl p-8 dark:border-slate-800 bg-white dark:bg-slate-900 ${
          isPrefferedPlan ? 'border-2 border-blue-600 shadow-xl dark:border-blue-700' : 'border border-gray-200 dark:border-neutral-700'
        }`}
      >
        {isPrefferedPlan && (
          <p class="absolute left-1/2 transform -translate-x-1/2 top-[-10px] right-[-10px] z-20">
            <span class="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-lg text-xs uppercase font-semibold bg-blue-100 text-blue-800 dark:bg-blue-600 dark:text-white">
              Most popular
            </span>
          </p>
        )}
        <h4 class="font-medium text-lg text-gray-800 dark:text-neutral-200">{plan.DISPLAY_NAME}</h4>
        <span class="mt-7 font-bold text-5xl text-gray-800 dark:text-neutral-200">
          {billing === 'yearly' ? `$${plan.YEARLY_PRICE / 12}` : `$${plan.MONTHLY_PRICE}`}
          <span class="text-sm font-normal dark:text-gray-400 text-gray-600"> / month</span>
        </span>
        <p class="mt-2 text-sm text-gray-500 dark:text-neutral-500">{plan.MONTHLY_PRICE <= 0 ? 'Forever free' : `Billed ${billing}`}</p>

        <ul class="mt-7 space-y-2.5 text-sm">
          {Object.entries(plan.FEATURES).map(([featureKey, feature]) => {
            if (!feature?.marketingText) {
              return null;
            }

            return (
              <li class="flex space-x-2" key={featureKey}>
                <LuCheck class="h-4 w-4 text-blue-600 dark:text-blue-500 mt-0.5" />
                <span class="text-gray-800 dark:text-neutral-400">{feature.marketingText}</span>
              </li>
            );
          })}
        </ul>

        <a
          class="mt-5 py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-gray-200 text-gray-500 hover:border-blue-600 hover:text-blue-600 disabled:opacity-50 disabled:pointer-events-none dark:border-neutral-700 dark:text-neutral-400 dark:hover:text-blue-500 dark:hover:border-blue-600"
          href={href || '#'}
          onClick$={() => {
            clickHandler && clickHandler(plan, billing === 'yearly' ? plan.PADDLE_YEARLY_PRICE_ID : plan.PADDLE_MONTHLY_PRICE_ID);
          }}
        >
          {buttonText}
        </a>
        {plan.MONTHLY_PRICE <= 0 && <p class="mt-2 text-xs text-gray-500 dark:text-neutral-500">No credit card required</p>}
      </div>
    );
  }
);
