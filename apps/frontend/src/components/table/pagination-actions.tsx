import { Signal, component$ } from '@builder.io/qwik';
import { ResponseData } from './table-server-pagination';

export interface PaginationActionsProps {
  tableData: Signal<ResponseData>;
  page: Signal<number>;
  limit: Signal<number>;
  maxPages: Signal<number>;
  isOnFirstPage: Signal<boolean>;
  isOnLastPage: Signal<boolean>;
}

export const PaginationActions = component$((props: PaginationActionsProps) => {
  const { page, limit, tableData, maxPages, isOnFirstPage, isOnLastPage } = props;

  return (
    <div class="flex gap-2">
      <div class="join">
        <button class="join-item btn" onClick$={() => (page.value = 1)} disabled={isOnFirstPage.value}>
          {'<<'}
        </button>
        <button class="join-item btn" onClick$={() => (page.value = page.value - 1)} disabled={isOnFirstPage.value}>
          {'<'}
        </button>
        <button class="join-item btn">{page.value}</button>
        <button class="join-item btn" onClick$={() => (page.value = page.value + 1)} disabled={isOnLastPage.value}>
          {'>'}
        </button>
        <button class="join-item btn" onClick$={() => (page.value = maxPages.value - 1)} disabled={isOnLastPage.value}>
          {'>>'}
        </button>
      </div>

      <span class="flex items-center gap-1">
        Page {page.value} of {maxPages.value}
      </span>
    </div>
  );
});
