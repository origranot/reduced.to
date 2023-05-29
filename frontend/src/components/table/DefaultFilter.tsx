import { component$, QRL } from '@builder.io/qwik';

export interface FilterInputProps {
  column: { filterValue: string; setFilter: QRL<(ev: Event) => void> };
}

export const FilterInput = component$<FilterInputProps>(
  ({ column: { filterValue = '', setFilter } }) => {
    return (
      <input
        type="text"
        value={filterValue}
        onInput$={(ev: Event) => setFilter(ev)}
        placeholder={`Search...`}
        style={{ width: '100%' }}
      />
    );
  }
);
