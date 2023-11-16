import { component$ } from '@builder.io/qwik';

export interface LinkSkeletonProps {
  opacity?: number;
}

export const LinkSkeleton = component$((props: LinkSkeletonProps) => {
  return (
    <div class={`block w-full dark:bg-slate-800 rounded-md shadow-lg border border-base-200 p-3`} style={{ opacity: props.opacity || 1 }}>
      <div class="flex flex-col gap-4 w-full">
        <div class="flex gap-2 items-center">
          <div class="skeleton w-10 h-10 rounded-full shrink-0 dark:bg-slate-600"></div>
          <div class="flex flex-col gap-2 w-full">
            <div class="skeleton h-4 w-2/5 rounded-full dark:bg-slate-600"></div>
            <div class="skeleton h-4 w-3/5 dark:bg-slate-600"></div>
          </div>
          <div class="skeleton w-8 h-8 rounded-full shrink-0 dark:bg-slate-600"></div>
          <div class="skeleton w-8 h-8 rounded-full shrink-0 dark:bg-slate-600 mr-2"></div>
        </div>
      </div>
    </div>
  );
});
