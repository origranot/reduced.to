import { component$, Signal } from '@builder.io/qwik';

export interface FilterInputProps {
  filter: Signal<string>;
  onInput: (ev: InputEvent) => void;
}

export const FilterInput = component$<FilterInputProps>(({ filter, onInput }) => {
  return (
    <div class="block">
      <label for="table-search" class="sr-only">
        Search
      </label>
      <div class="flex items-center ml-3">
        <svg
          class="w-4 h-4 text-gray-500 dark:text-gray-400 z-10 mr-[-1.25rem] mb-[0.5rem]"
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
        <input
          type="text"
          value={filter.value || ''}
          onInput$={(ev: InputEvent) => onInput(ev)}
          placeholder="Search..."
          class="input input-bordered block p-2 pl-10 w-full mb-2 ml-[-0.5rem]"
        />
      </div>
    </div>
  );
});
