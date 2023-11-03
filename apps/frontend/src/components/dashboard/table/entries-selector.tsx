import { component$, QwikChangeEvent, Signal, $ } from '@builder.io/qwik';

export interface EntriesSelectorProps {
  pageSize: Signal<number>;
  pageSizeOptions?: number[];
}

export const EntriesSelector = component$<EntriesSelectorProps>(({ pageSize, pageSizeOptions }) => {
  const PAGE_SIZE_OPTIONS = pageSizeOptions || [10, 20, 50, 100];

  const handlePageSizeChange = $((event: QwikChangeEvent<HTMLSelectElement>) => {
    pageSize.value = parseInt(event.target.value, 10);
  });

  return (
    <div class="flex items-center gap-2">
      <span>Show</span>
      <select class="select select-md select-bordered max-w-xs" value={pageSize.value} onChange$={handlePageSizeChange}>
        {PAGE_SIZE_OPTIONS.map((option) => (
          <option key={option} value={option}>
            {option.toString()}
          </option>
        ))}
      </select>
      <span>Entries</span>
    </div>
  );
});
