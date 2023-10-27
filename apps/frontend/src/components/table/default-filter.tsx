import { component$, PropFunction, Signal } from '@builder.io/qwik';

export interface FilterInputProps {
  filter: Signal<string>;
}

export const FilterInput = component$<FilterInputProps>(({ filter }) => {
  return (
    <input
      type="text"
      value={filter.value || ''}
      onInput$={(ev: InputEvent) => (filter.value = (ev.target as HTMLInputElement).value)}
      placeholder={`Search...`}
      style={{ width: '100%' }}
      class="input input-bordered w-full max-w-xs my-5"
    />
  );
});
