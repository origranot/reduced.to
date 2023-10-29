import { component$, Signal } from '@builder.io/qwik';

export interface FilterInputProps {
  filter: Signal<string>;
  onInput: (ev: InputEvent) => void;
}

export const FilterInput = component$<FilterInputProps>(({ filter, onInput }) => {
  return (
    <input
      type="text"
      value={filter.value || ''}
      onInput$={(ev: InputEvent) => onInput(ev)}
      placeholder={`Search...`}
      style={{ width: '100%' }}
      class="input input-bordered w-full max-w-xs mb-5"
    />
  );
});
