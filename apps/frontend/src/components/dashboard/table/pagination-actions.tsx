import { Signal, component$ } from '@builder.io/qwik';
import { ResponseData } from './table-server-pagination';
import { HiChevronDoubleLeftMini, HiChevronDoubleRightMini, HiChevronLeftMini, HiChevronRightMini } from '@qwikest/icons/heroicons';

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

  const formatValue = () => {
    if (tableData.value.total === 0) {
      return '0 - 0 of 0';
    }

    const current = page.value * limit.value;
    const first = (page.value - 1) * limit.value + 1;
    const last = current > tableData.value.total ? tableData.value.total : current;

    return `${first} - ${last} of ${tableData.value.total}`;
  };

  return (
    <div class="flex gap-3">
      <span class="flex items-center">{formatValue()}</span>
      <div class="join">
        <button class="join-item btn" onClick$={() => (page.value = 1)} disabled={isOnFirstPage.value}>
          <HiChevronDoubleLeftMini />
        </button>
        <button class="join-item btn" onClick$={() => (page.value = page.value - 1)} disabled={isOnFirstPage.value}>
          <HiChevronLeftMini />
        </button>
        <button class="join-item btn" onClick$={() => (page.value = page.value + 1)} disabled={isOnLastPage.value}>
          <HiChevronRightMini />
        </button>
        <button class="join-item btn" onClick$={() => (page.value = maxPages.value)} disabled={isOnLastPage.value}>
          <HiChevronDoubleRightMini />
        </button>
      </div>
    </div>
  );
});
