import { $, component$, Slot } from '@builder.io/qwik';
import { LuBadgeCheck } from '@qwikest/icons/lucide';
import { PLAN_LEVELS, FEATURES } from '@reduced.to/subscription-manager';
import { useGetCurrentUser } from '../../../../frontend/src/routes/layout';

interface ConditionalWrapperProps {
  access: keyof typeof FEATURES;
  cs?: string;
}

export function getRequiredFeatureLevel(currentPlan: string, access: keyof typeof FEATURES) {
  let requiredLevel = '';
  for (const planName in PLAN_LEVELS) {
    const plan = PLAN_LEVELS[planName];
    if (plan.FEATURES[access]?.enabled === true) {
      if (currentPlan === planName) return null;
      if (!requiredLevel) requiredLevel = plan.DISPLAY_NAME;
    }
  }
  return requiredLevel || 'PRO';
}

export const ConditionalWrapper = component$(({ access, cs }: ConditionalWrapperProps) => {
  const user = useGetCurrentUser();
  const plan = user?.value?.plan || 'FREE';
  const level = getRequiredFeatureLevel(plan, access);

  if (!level) {
    return <Slot />;
  }

  const onClick = $((e: Event) => {
    e.preventDefault();
  });

  return (
    <div class={`relative border-dark-grey bg-inherit rounded ${cs ? cs : ''}`} onClick$={onClick}>
      <div
        class={`
        tooltip tooltip-left absolute badge badge-ghost z-100 cursor-pointer
           left-1/2 transform -translate-x-1/2
          p-3 flex items-center`}
        data-tip={`This feature is aviailable in the ${level} plan`}
      >
        <LuBadgeCheck class="mr-2 w-4 h-4" />
        <span>{level}</span>
      </div>
      <div
        class="z-10"
        preventdefault:click
        onClick$={(e) => e.stopPropagation()}
        preventdefault:input
        onInput$={(e) => e.stopPropagation()}
      >
        <Slot />
      </div>
    </div>
  );
});
