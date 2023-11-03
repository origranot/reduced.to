import { component$, Signal } from '@builder.io/qwik';

export interface FilterInputProps {
  filter: Signal<string>;
  onInput: (ev: InputEvent) => void;
}

export const FilterInput = component$<FilterInputProps>(({ filter, onInput }) => {
  return (
    <>
      <label for="table-search" class="sr-only">
        Search
      </label>
      <div class="relative">
        <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg
            class="w-4 h-4 text-gray-500 dark:text-gray-400"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 20"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
            />
          </svg>
        </div>
        <input
          type="text"
          value={filter.value || ''}
          onInput$={(ev: InputEvent) => onInput(ev)}
          placeholder={`Search...`}
          style={{ width: '100%' }}
          class="input input-bordered block p-2 pl-10 w-full mb-2"
        />{' '}
      </div>
    </>
  );
});
