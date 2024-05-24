import { component$, useSignal } from '@builder.io/qwik';
import { LuCheck } from '@qwikest/icons/lucide';
import { FEATURES } from '../features/consts';

type Plan = 'Free' | 'Pro' | 'Business';

interface PlanDetails {
  name: string;
  monthlyPrice: number;
  annualPrice: number;
  features: Partial<Record<keyof typeof FEATURES, { value: string | boolean; descriptionOnCard?: string; showInCard?: boolean }>>;
}

const PREFERRED_PLAN: Plan = 'Pro';

const plans: Record<Plan, PlanDetails> = {
  Free: fillPlanFeatures({
    name: 'Free',
    monthlyPrice: 0,
    annualPrice: 0,
    features: {
      LINKS_COUNT: { value: '10/month', descriptionOnCard: '10 new links/mo', showInCard: true },
      LINKS_CLICKS: { value: 'Unlimited' },
      TRACKED_CLICKS: { value: '500/month', descriptionOnCard: '500 tracked clicks/mo', showInCard: true },
      ANALYTICS_REPORTS: { value: '7 days analytics', showInCard: true },
      UTM_BUILDER: { value: true },
    },
  }),
  Pro: fillPlanFeatures({
    name: 'Pro',
    monthlyPrice: 9,
    annualPrice: 7,
    features: {
      LINKS_COUNT: { value: '500/month', descriptionOnCard: '500 new links/mo', showInCard: true },
      LINKS_CLICKS: { value: 'Unlimited' },
      TRACKED_CLICKS: { value: '20,000/month', descriptionOnCard: '20K tracked clicks/mo', showInCard: true },
      ANALYTICS_REPORTS: { value: '30 days analytics', showInCard: true },
      UTM_BUILDER: { value: true },
      QR_CODES: { value: true },
      PASSWORD_PROTECTION: { value: true },
      LINK_EXPIRATION: { value: true },
      CUSTOM_SHORT_KEY: { value: true },
    },
  }),
  Business: fillPlanFeatures({
    name: 'Business',
    monthlyPrice: 30,
    annualPrice: 25,
    features: {
      LINKS_COUNT: { value: '2,000/month', descriptionOnCard: '2,000 new links/mo', showInCard: true },
      LINKS_CLICKS: { value: 'Unlimited' },
      TRACKED_CLICKS: { value: '100,000/month', descriptionOnCard: '100K tracked clicks/mo', showInCard: true },
      ANALYTICS_REPORTS: { value: '1 year analytics', showInCard: true },
      UTM_BUILDER: { value: true },
      QR_CODES: { value: true },
      PASSWORD_PROTECTION: { value: true },
      LINK_EXPIRATION: { value: true },
      CUSTOM_SHORT_KEY: { value: true },
    },
  }),
};

function fillPlanFeatures(plan: PlanDetails): PlanDetails {
  const filledFeatures: Partial<Record<keyof typeof FEATURES, { value: string | boolean; showInCard?: boolean }>> = { ...plan.features };
  for (const featureKey of Object.keys(FEATURES) as (keyof typeof FEATURES)[]) {
    if (!filledFeatures[featureKey]) {
      filledFeatures[featureKey] = { value: false };
    }
  }
  return {
    ...plan,
    features: filledFeatures,
  };
}

export const Pricing = component$(() => {
  const annual = useSignal(true);

  return (
    <div class="px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div class="mx-auto text-center mb-10 lg:mb-14">
        <h2 class="text-2xl font-bold md:text-4xl md:leading-tight text-gray-800 dark:text-gray-200">Pricing</h2>
        <p class="mt-1 text-gray-600 dark:text-gray-400">Whatever your status, our offers evolve according to your needs.</p>
      </div>

      <div class="flex justify-center items-center mb-12">
        <label class="min-w-14 text-sm text-gray-500 me-3 dark:text-neutral-400">Monthly</label>
        <input type="checkbox" class="toggle toggle-primary" checked={annual.value} onChange$={() => (annual.value = !annual.value)} />
        <label class="relative min-w-14 text-sm text-gray-500 ms-3 dark:text-neutral-400">
          Yearly
          <span class="absolute sm:block hidden -top-10 start-auto -end-28">
            <span class="flex items-center">
              <svg class="w-14 h-8 -me-6" width="45" height="25" viewBox="0 0 45 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M43.2951 3.47877C43.8357 3.59191 44.3656 3.24541 44.4788 2.70484C44.5919 2.16427 44.2454 1.63433 43.7049 1.52119L43.2951 3.47877ZM4.63031 24.4936C4.90293 24.9739 5.51329 25.1423 5.99361 24.8697L13.8208 20.4272C14.3011 20.1546 14.4695 19.5443 14.1969 19.0639C13.9242 18.5836 13.3139 18.4152 12.8336 18.6879L5.87608 22.6367L1.92723 15.6792C1.65462 15.1989 1.04426 15.0305 0.563943 15.3031C0.0836291 15.5757 -0.0847477 16.1861 0.187863 16.6664L4.63031 24.4936ZM43.7049 1.52119C32.7389 -0.77401 23.9595 0.99522 17.3905 5.28788C10.8356 9.57127 6.58742 16.2977 4.53601 23.7341L6.46399 24.2659C8.41258 17.2023 12.4144 10.9287 18.4845 6.96211C24.5405 3.00476 32.7611 1.27399 43.2951 3.47877L43.7049 1.52119Z"
                  fill="currentColor"
                  class="fill-gray-300 dark:fill-neutral-700"
                />
              </svg>
              <span class="mt-3 inline-block whitespace-nowrap text-[11px] leading-5 font-semibold tracking-wide uppercase bg-blue-600 text-white rounded-full py-1 px-2.5">
                2 months free
              </span>
            </span>
          </span>
        </label>
      </div>

      <div class="flex flex-col md:flex-row justify-center space-y-6 md:space-y-0 md:space-x-6">
        {Object.entries(plans).map(([planKey, plan]) => (
          <div
            class={`relative flex flex-col text-center rounded-xl p-8 dark:border-slate-800 bg-white dark:bg-slate-900 ${
              planKey === PREFERRED_PLAN
                ? 'border-2 border-blue-600 shadow-xl dark:border-blue-700'
                : 'border border-gray-200 dark:border-neutral-700'
            }`}
            key={planKey}
          >
            {planKey === PREFERRED_PLAN && (
              <p class="absolute left-1/2 transform -translate-x-1/2 top-[-10px] right-[-10px] z-20">
                <span class="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-lg text-xs uppercase font-semibold bg-blue-100 text-blue-800 dark:bg-blue-600 dark:text-white">
                  Most popular
                </span>
              </p>
            )}
            <h4 class="font-medium text-lg text-gray-800 dark:text-neutral-200">{plan.name}</h4>
            <span class="mt-7 font-bold text-5xl text-gray-800 dark:text-neutral-200">
              {annual.value ? `$${plan.annualPrice}` : `$${plan.monthlyPrice}`}
              <span class="text-sm font-normal dark:text-gray-400 text-gray-600"> / month</span>
            </span>
            <p class="mt-2 text-sm text-gray-500 dark:text-neutral-500">
              {planKey === 'Free' ? 'Forever free' : `Billed ${annual.value ? 'yearly' : 'monthly'}`}
            </p>

            <ul class="mt-7 space-y-2.5 text-sm">
              {Object.entries(plan.features).map(([featureKey, feature]) => {
                if (!feature?.value || !feature.showInCard) {
                  return null;
                }

                return (
                  <li class="flex space-x-2" key={featureKey}>
                    <LuCheck class="h-4 w-4 text-blue-600 dark:text-blue-500 mt-0.5" />
                    <span class="text-gray-800 dark:text-neutral-400">{feature.descriptionOnCard ?? feature.value}</span>
                  </li>
                );
              })}
            </ul>

            <a
              class="mt-5 py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-gray-200 text-gray-500 hover:border-blue-600 hover:text-blue-600 disabled:opacity-50 disabled:pointer-events-none dark:border-neutral-700 dark:text-neutral-400 dark:hover:text-blue-500 dark:hover:border-blue-600"
              href="/register"
            >
              Get Started
            </a>
            <p class="mt-2 text-xs text-gray-500 dark:text-neutral-500">No credit card required</p>
          </div>
        ))}
      </div>

      <div class="mt-12">
        <h3 class="text-2xl font-bold text-center text-gray-800 dark:text-gray-200">Plans Comparison</h3>
        <div class="overflow-x-scroll md:overflow-x-visible w-full mt-6 rounded-lg shadow-lg border border-gray-200 dark:border-neutral-700">
          <table class="table-fixed overflow-scroll w-full bg-white dark:bg-gray-900">
            <thead>
              <tr class="divide-x divide-gray-200 dark:divide-neutral-700 border-b border-gray-200 dark:border-neutral-700">
                <th class="sticky left-0 z-20 w-40 bg-gray-50 dark:bg-gray-900 p-6 md:top-14 md:w-1/4"></th>
                {Object.entries(plans).map(([planKey, plan]) => (
                  <th class="sticky md:top-14 w-40 bg-gray-50 p-6 dark:bg-gray-900 dark:border-neutral-700" key={planKey}>
                    <div class="mb-4 flex items-center space-x-2">
                      <h1 class="font-display text-xl font-bold text-black md:text-2xl dark:text-white">{plan.name}</h1>
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
              {Object.entries(FEATURES).map(([featureKey, feature]) => (
                <tr class="divide-x divide-gray-200 dark:divide-neutral-700" key={featureKey}>
                  <td class="sticky left-0 bg-gray-50 shadow-[5px_0px_10px_-3px_rgba(0,0,0,0.1)] dark:bg-gray-900">
                    <div class="flex items-center justify-between space-x-2 p-4">
                      <p class="font-medium text-black dark:text-white">{feature.title}</p>
                      <div class="tooltip tooltip-right z-30" data-tip={feature.description}>
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
                    <td class="p-4 text-center text-gray-600 dark:text-neutral-400" key={planKey}>
                      {plan.features[featureKey]?.value ? (
                        typeof plan.features[featureKey]?.value === 'boolean' ? (
                          <span class="text-center">
                            <LuCheck class="inline h-4 w-4 text-blue-600 dark:text-blue-500" />
                          </span>
                        ) : (
                          plan.features[featureKey]?.value
                        )
                      ) : (
                        <span class="text-gray-400 dark:text-neutral-500">-</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
});
