import { JSXNode, Signal, component$ } from '@builder.io/qwik';

export type StatsCardValue = {
  value?: string;
  description?: JSXNode;
  loading?: boolean;
};

export interface StatsCardProps {
  title: string;
  data: Signal<StatsCardValue>;
}

export const StatsCard = component$<StatsCardProps>(({ data: { value }, title }) => {
  return (
    <>
      {value.loading ? (
        <>
          <div role="status" class="p-4 border border-gray-200 rounded-2xl shadow animate-pulse md:p-6 dark:border-gray-700">
            <div class="h-1 bg-gray-200 rounded-full dark:bg-gray-700 w-20 mb-1"></div>
            <div class="w-24 h-1 mb-6 bg-gray-200 rounded-full dark:bg-gray-700"></div>
            <div class="flex items-baseline mt-2 space-x-3">
              <div class="w-1/3 bg-gray-200 rounded-t-lg h-6 dark:bg-gray-700"></div>
              <div class="w-1/3 h-5 bg-gray-200 rounded-t-lg dark:bg-gray-700"></div>
              <div class="w-1/3 bg-gray-200 rounded-t-lg h-6 dark:bg-gray-700"></div>
            </div>
            <span class="sr-only">Loading...</span>
          </div>
        </>
      ) : (
        <div class="stats shadow-[0_8px_30px_rgb(0,0,0,0.12)] bg-base-200">
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
