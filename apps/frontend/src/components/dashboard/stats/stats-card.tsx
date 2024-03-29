import { JSXNode, JSXOutput, Signal, component$ } from '@builder.io/qwik';

export type StatsCardValue = {
  value?: string;
  description?: JSXOutput;
  loading?: boolean;
};

export interface StatsCardProps {
  title: string;
  data: Signal<StatsCardValue>;
  loading?: boolean;
}

export const StatsCard = component$<StatsCardProps>(({ data: { value }, title, loading }) => {
  return (
    <>
      {loading ? (
        <>
          <div role="status" class="p-4 border border-gray-200 rounded-2xl shadow animate-pulse md:p-6 dark:border-gray-700">
            <div class="flex flex-col gap-3 items-center">
              <div class="skeleton h-3 w-1/2"></div>
              <div class="skeleton h-3 w-1/4"></div>
              <div class="skeleton h-3 w-full"></div>
            </div>
            <span class="sr-only">Loading...</span>
          </div>
        </>
      ) : (
        <div class="stats shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:bg-purple-950">
          <div class="stat">
            <div class="stat-title">{title}</div>
            {value.loading ? <div class="loading loading-ring loading-lg"></div> : <div class="stat-value">{value.value}</div>}
            {value.description && <div class="stat-desc">{value.description}</div>}
          </div>
        </div>
      )}
    </>
  );
});
