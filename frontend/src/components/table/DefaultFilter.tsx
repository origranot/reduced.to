import { component$, PropFunction, Signal } from '@builder.io/qwik';

export interface FilterInputProps {
  filterValue: Signal<string>;
  setFilter$: PropFunction<(val: string) => void>;
}

export const FilterInput = component$<FilterInputProps>(({ filterValue = '', setFilter$ }) => {
  return (
    <input
      type="text"
      value={(filterValue as Signal<string>).value}
      onInput$={(ev: InputEvent) => setFilter$((ev.target as HTMLInputElement)?.value || '')}
      placeholder={`Search...`}
      style={{ width: '100%' }}
      class="input input-bordered w-full max-w-xs my-5"
    />
  );
});
