import { component$ } from '@builder.io/qwik';

export interface NoDataProps {
  title: string;
  description: string;
}

export const NoData = component$(({ title, description }: NoDataProps) => {
  return (
    <>
      <div class="text-3xl">🦄</div>
      <span class="block text-xl font-semibold">{title}</span>
      <span class="block text-lg">{description}</span>
      <span class="block text-sm">Meanwhile, here's a unicorn to brighten your day!</span>
    </>
  );
});
