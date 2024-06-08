import { component$, useSignal } from '@builder.io/qwik';
import { LuCheck } from '@qwikest/icons/lucide';
import { PLAN_LEVELS, FEATURES, FeatureKey } from '@reduced.to/subscription-manager';
import { BillingCard } from './billing-card';
import { AnnualToggle } from './annual-toggle';
import { useGetCurrentUser } from '../../routes/layout';

const PREFERRED_PLAN = PLAN_LEVELS.PRO.DISPLAY_NAME;

const plans = Object.keys(PLAN_LEVELS).map((key) => {
  return PLAN_LEVELS[key];
});

export const Pricing = component$(() => {
  const annual = useSignal(true);
  const user = useGetCurrentUser();

  return (
    <div class="px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div class="mx-auto text-center mb-10 lg:mb-14">
        <h2 class="font-bold text-3xl sm:text-5xl md:leading-tight text-gray-800 dark:text-gray-200">Pricing</h2>
        <p class="mt-1 text-gray-600 dark:text-gray-400">Whatever your status, our offers evolve according to your needs.</p>
      </div>

      <div class="mb-12">
        {' '}
        <AnnualToggle annual={annual} />{' '}
      </div>
      <div class="flex flex-col md:flex-row justify-center space-y-6 md:space-y-0 md:space-x-6">
        {Object.values(plans).map((value, index) => (
          <BillingCard
            href={`${user.value ? '/dashboard' : '/register'}`}
            key={index}
            plan={value}
            billing={annual.value ? 'yearly' : 'monthly'}
            isPrefferedPlan={value.DISPLAY_NAME === PREFERRED_PLAN}
          />
        ))}
      </div>

      <div class="mt-12 max-w-[85rem] mx-auto">
        <h3 class="text-2xl md:text-4xl font-bold text-center text-gray-800 dark:text-gray-200">Plans Comparison</h3>
        <div class="overflow-x-scroll md:overflow-x-visible w-full mt-6 rounded-lg shadow-lg border border-gray-200 dark:border-neutral-700">
          <table class="table-fixed overflow-scroll w-full bg-white dark:bg-gray-900">
            <thead>
              <tr class="divide-x divide-gray-200 dark:divide-neutral-700 border-b border-gray-200 dark:border-neutral-700">
                <th class="sticky left-0 z-20 w-40 bg-gray-50 dark:bg-gray-900 p-6 md:top-14 md:w-1/4"></th>
                {Object.entries(plans).map(([planKey, plan]) => (
                  <th class="sticky md:top-14 w-40 bg-gray-50 p-6 dark:bg-gray-900 dark:border-neutral-700" key={planKey}>
                    <div class="mb-4 flex items-center space-x-2">
                      <h1 class="font-display text-xl font-bold text-black md:text-2xl dark:text-white">{plan.DISPLAY_NAME}</h1>
                    </div>
                    <a
                      class="block w-full rounded-full py-1 text-center text-sm font-medium text-white transition-all duration-200 ease-in-out hover:ring-[3px] md:py-1.5 md:text-base dark:text-white bg-blue-600/90"
                      href="/register"
                    >
                      {planKey === 'Free' ? 'Start for free' : 'Get started'}
                    </a>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-neutral-700">
              {Object.entries(FEATURES).map(([featureKey, feature]) => {
                return (
                  <tr class="divide-x divide-gray-200 dark:divide-neutral-700" key={featureKey}>
                    <td class="sticky left-0 bg-gray-50 shadow-[5px_0px_10px_-3px_rgba(0,0,0,0.1)] dark:bg-gray-900">
                      <div class="flex items-center justify-between space-x-2 p-4">
                        <p class="font-medium text-black dark:text-white">{feature.displayName}</p>
                        <div class="tooltip tooltip-right z-30" data-tip={feature.tooltip}>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            class="lucide lucide-circle-help h-4 w-4 flex-none text-gray-600 dark:text-neutral-400"
                          >
                            <circle cx="12" cy="12" r="10"></circle>
                            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                            <path d="M12 17h.01"></path>
                          </svg>
                        </div>
                      </div>
                    </td>
                    {Object.entries(plans).map(([planKey, plan]) => (
                      <td class="p-4 text-center text-gray-600 dark:text-neutral-400 dark:bg-slate-900" key={planKey}>
                        {plan.FEATURES[featureKey as FeatureKey]?.enabled ? (
                          !plan.FEATURES[featureKey as FeatureKey].description ? (
                            <span class="text-center">
                              <LuCheck class="inline h-4 w-4 text-blue-600 dark:text-blue-500" />
                            </span>
                          ) : (
                            plan.FEATURES[featureKey as FeatureKey].description
                          )
                        ) : (
                          <span class="text-gray-400 dark:text-neutral-500">-</span>
                        )}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
});
