import { component$ } from '@builder.io/qwik';

export interface LinkPlaceholderProps {
  opacity?: number;
}

export const LinkPlaceholder = component$((props: LinkPlaceholderProps) => {
  return <div class={`block w-full animate-fade dark:bg-slate-800 rounded-md shadow-lg border-2 opacity-40 p-3 h-[60px] border-dotted border-slate-400 dark:border-slate-500 dark:opacity-1`}>
  </div>;
});
