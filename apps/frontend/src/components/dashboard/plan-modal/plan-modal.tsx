import { component$, useSignal, $ } from '@builder.io/qwik';
import { getPlanByPaddleId, PLAN_LEVELS, Plan, FEATURES, FeatureKey } from '@reduced.to/subscription-manager';
import { Form } from '@builder.io/qwik-city';
import { useGetCurrentUser } from '../../../routes/layout';
import { CheckoutEventNames, Paddle } from '@paddle/paddle-js';
import { DARK_THEME, getCurrentTheme } from '../../theme-switcher/theme-switcher';
import { useChangePlan } from './use-change-plan';
import { CONFIRM_MODAL_ID, ConfirmModal } from './confirm-modal';
import { useRevalidatePlan } from '../../../../../frontend/src/routes/dashboard/settings/billing/use-revalidate-plan';
import { LuCheck } from '@qwikest/icons/lucide';
import { CANCEL_PLAN_MODAL_ID, useCancelPlan } from '../../../routes/dashboard/settings/billing/use-cancel-plan';
import { GenericModal } from '../generic-modal/generic-modal';

export const PLAN_MODAL_ID = 'plan-modal';

interface PlanModalProps {
  id: string;
  paddle?: Paddle;
}

export const PlanModal = component$(({ id, paddle }: PlanModalProps) => {
  const changePlanAction = useChangePlan();
  const user = useGetCurrentUser();
  const revalidatePlan = useRevalidatePlan();
  const currentPlan = PLAN_LEVELS[user.value?.plan || 'FREE'];
  const filteredPlans = Object.values(PLAN_LEVELS).filter((plan) => plan.YEARLY_PRICE > 0);

  const billingCycle = useSignal<'monthly' | 'yearly'>('yearly');

  const selectValue = useSignal(filteredPlans[0].PADDLE_PLAN_ID);
  const selectedPriceId = useSignal(filteredPlans[0].PADDLE_YEARLY_PRICE_ID);
  const selectedPlan = useSignal<Plan>(getPlanByPaddleId(selectValue.value!)!);
  const selectedOperation = useSignal<'upgrade' | 'downgrade' | 'cancel'>('upgrade');

  const cancelPlanAction = useCancelPlan();

  const onChangeSubscription = $((operation: 'upgrade' | 'downgrade' | 'cancel') => {
    if (!user.value) {
      return;
    }

    (document.getElementById(id) as any).close();
    if (user.value.plan === 'FREE') {
      paddle?.Checkout.open({
        settings: {
          displayMode: 'overlay',
          locale: 'en',
          theme: getCurrentTheme() === DARK_THEME ? 'dark' : 'light',
        },
        items: [
          {
            priceId: selectedPriceId.value!,
            quantity: 1,
          },
        ],
        customData: {
          userId: user.value?.id,
        },
      });
      paddle?.Update({
        eventCallback: async (data) => {
          if (data.name == CheckoutEventNames.CHECKOUT_COMPLETED) {
            setTimeout(revalidatePlan.submit, 2000);
          }
        },
      });
      return;
    }
    if (operation === 'cancel') {
      (document.getElementById(CANCEL_PLAN_MODAL_ID) as any).showModal();
      return;
    }

    // If it's not cancel plan, then it's either upgrade or downgrade
    selectedOperation.value = operation;
    (document.getElementById(CONFIRM_MODAL_ID) as any).showModal();
  });

  return (
    <>
      <ConfirmModal
        id={CONFIRM_MODAL_ID}
        planId={selectedPlan.value.PADDLE_PLAN_ID}
        priceId={selectedPriceId.value}
        operation={selectedOperation.value as 'upgrade' | 'downgrade'}
        action={changePlanAction}
      />
      <GenericModal id={CANCEL_PLAN_MODAL_ID} confirmation="CANCEL" operationType="cancel" type="subscription" action={cancelPlanAction} />
      <dialog id={id} class="modal">
        <Form class="modal-box max-w-lg p-0">
          <div class="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-900 shadow-sm">
            <div class="pt-5 px-8">
              <div class="flex justify-center items-center mb-2 gap-2">
                <img src="/favicon.png" alt="Reduced.to logo" class="w-14 h-14" />
              </div>
              <h1 class="text-2xl font-semibold text-center dark:text-gray-300">Discover the Perfect Plan</h1>
              <p class="text-center text-gray-500 mb-4">Choose the best plan that fits your needs and upgrade for more features.</p>
              <div class="px-2">
                <div class="flex flex-row gap-x-2">
                  <select
                    class="select select-bordered w-7/12"
                    value={selectValue.value}
                    onChange$={(event) => {
                      selectValue.value = (event.target as HTMLSelectElement).value;
                      selectedPlan.value = getPlanByPaddleId(selectValue.value!)!;
                      selectedPriceId.value =
                        billingCycle.value === 'monthly'
                          ? selectedPlan.value.PADDLE_MONTHLY_PRICE_ID!
                          : selectedPlan.value.PADDLE_YEARLY_PRICE_ID!;
                    }}
                  >
                    {filteredPlans.map((plan) => (
                      <option key={plan.PADDLE_PLAN_ID} value={plan.PADDLE_PLAN_ID}>
                        {plan.DISPLAY_NAME}
                      </option>
                    ))}
                  </select>
                  <select
                    class="select select-bordered w-5/12"
                    value={billingCycle.value}
                    onChange$={(event) => {
                      const value = (event.target as HTMLSelectElement).value;
                      billingCycle.value = value as 'monthly' | 'yearly';
                      selectedPriceId.value =
                        billingCycle.value === 'monthly'
                          ? selectedPlan.value.PADDLE_MONTHLY_PRICE_ID!
                          : selectedPlan.value.PADDLE_YEARLY_PRICE_ID!;
                    }}
                  >
                    <option value="yearly">Yearly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
                <h3 class="text-center mt-4 font-semibold dark:text-gray-300">
                  <span class="badge badge-outline">
                    {billingCycle.value === 'monthly' ? selectedPlan.value.MONTHLY_PRICE : selectedPlan.value.YEARLY_PRICE}$
                  </span>
                </h3>
                <div class="text-xs pb-4 dark:text-gray-400">Payment will be on a {billingCycle.value} basis</div>
              </div>
            </div>
          </div>
          <div class="pb-5 px-8 mt-2">
            <ul class="py-2 flex flex-col px-2 pl-6 w-full space-y-2">
              {Object.entries(selectedPlan.value.FEATURES).map(([key, feature]) => {
                const description = FEATURES[key as FeatureKey];
                if (!feature.marketingText && !description.displayName) {
                  return null;
                }

                return (
                  <li class="flex space-x-6" key={key}>
                    <LuCheck class="h-4 w-4 text-blue-600 dark:text-blue-500 mt-0.5" />
                    <span class="text-gray-800 dark:text-neutral-400">{feature.marketingText || description.displayName}</span>
                  </li>
                );
              })}
            </ul>
            {selectedPlan.value.PADDLE_PLAN_ID !== currentPlan.PADDLE_PLAN_ID ? (
              selectedPlan.value.LEVEL > currentPlan.LEVEL ? (
                <button class="mt-2 btn btn-primary btn-block" onClick$={() => onChangeSubscription('upgrade')}>
                  Upgrade
                </button>
              ) : (
                <button class="mt-2 btn btn-primary btn-block" onClick$={() => onChangeSubscription('downgrade')}>
                  Downgrade
                </button>
              )
            ) : (
              <button class="mt-2 btn btn-error btn-outline btn-block" onClick$={() => onChangeSubscription('cancel')}>
                Cancel Plan
              </button>
            )}
            <a href="/pricing" target="_blank" class="link mt-2 block text-center text-sm dark:text-gray-400">
              View all plans and features
            </a>
          </div>
        </Form>
        <form method="dialog" class="modal-backdrop">
          <button onClick$={() => (document.getElementById(id) as any).close()}>close</button>
        </form>
      </dialog>
    </>
  );
});
