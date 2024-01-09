import { component$, useSignal, $ } from '@builder.io/qwik';
import { FilterInput } from '../../table/default-filter';

export default component$(() => {
  const filterInput = useSignal('');

  return (
    <FilterInput
      filter={filterInput}
      onInput={$((ev: InputEvent) => {
        filterInput.value = (ev.target as HTMLInputElement).value;
      })}
    />  );
});
