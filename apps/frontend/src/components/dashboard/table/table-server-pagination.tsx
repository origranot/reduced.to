import { component$, useSignal, $, PropFunction, useVisibleTask$, QRL, Slot, JSXNode, UseSignal, Signal } from '@builder.io/qwik';
import { FilterInput } from './default-filter';
import { authorizedFetch } from '../../../shared/auth.service';
import { PaginationActions } from './pagination-actions';
import { HiChevronDownOutline, HiChevronUpDownOutline, HiChevronUpOutline } from '@qwikest/icons/heroicons';
import { EntriesSelector } from './entries-selector';

export enum SortOrder {
  DESC = 'desc',
  ASC = 'asc',
}

export interface PaginationParams {
  limit: number;
  page: number;
  filter?: string;
  sort?: Record<string, SortOrder>;
}

export type PaginationFetcher = ({ limit, page, filter, sort }: PaginationParams) => Promise<ResponseData>;

export type OptionalHeader = {
  displayName?: string;
  headerClassNames?: string;
  tdClassNames?: string;
  hide?: boolean;
  sortable?: boolean;
  format?: QRL<(opts: { row: any; value: string }) => JSXNode | string>;
};

export type Columns = Record<string, OptionalHeader>;

export interface TableServerPaginationParams {
  endpoint: string;
  columns: Columns;
  pageSize?: number;
  pageSizeOptions?: number[];
  refetch?: Signal<number>;
  defaultSort?: Record<string, SortOrder>;
}

export interface ResponseData {
  total: number;
  data: Record<string, unknown>[];
}

export const serializeQueryUserPaginationParams = (paginationParams: PaginationParams) => {
  const paramsForQuery = new URLSearchParams();
  paramsForQuery.set('limit', paginationParams.limit.toString());
  paramsForQuery.set('page', paginationParams.page.toString());

  if (paginationParams.filter) {
    paramsForQuery.set('filter', paginationParams.filter);
  }

  if (paginationParams.sort) {
    Object.entries(paginationParams.sort).forEach(([key, value]) => {
      paramsForQuery.set(`sort[${key}]`, value);
    });
  }

  return paramsForQuery.toString();
};

export const TableServerPagination = component$((props: TableServerPaginationParams) => {
  const filter = useSignal('');
  const currentPage = useSignal(1);
  const limit = useSignal(props.pageSize ?? 10);
  const sortSignal = useSignal<Record<string, SortOrder>>({});
  const tableData = useSignal<ResponseData>({ total: 0, data: [] });
  const maxPages = useSignal(0);

  const isOnFirstPage = useSignal(true);
  const isOnLastPage = useSignal(true);

  const isLoading = useSignal(true);

  const fetchTableData: PropFunction<PaginationFetcher> = $(async (paginationParams: PaginationParams) => {
    const queryParams = serializeQueryUserPaginationParams(paginationParams);
    const data = await authorizedFetch(`${props.endpoint}?${queryParams}`);
    const response = (await data.json()) as ResponseData;
    if (!response || !response.data) {
      console.warn('Server response is not valid', response);

      response.total = 0;
      response.data = [];
    }

    return response;
  });

  const onFilterInputChange = $(async (ev: InputEvent) => {
    filter.value = (ev.target as HTMLInputElement).value;
    currentPage.value = 1;
  });

  useVisibleTask$(async ({ track }) => {
    track(() => currentPage.value);
    track(() => limit.value);
    track(() => filter.value);
    track(() => sortSignal.value);
    track(() => props.refetch?.value);

    // Default sort if provided and no sort is set yet
    if (!Object.keys(sortSignal.value).length && props.defaultSort) {
      sortSignal.value = props.defaultSort;
    }

    // Fetch data
    const result = await fetchTableData({
      page: currentPage.value,
      limit: limit.value,
      filter: filter.value,
      sort: sortSignal.value,
    });

    tableData.value = result;
    maxPages.value = Math.ceil(result.total / limit.value || 1);

    // Update isOnFirstPage and isOnLastPage
    isOnFirstPage.value = currentPage.value === 1;
    isOnLastPage.value = currentPage.value >= maxPages.value;

    isLoading.value = false;
  });

  const sortColumn = (columnName: string) =>
    $(() => {
      if (!props.columns[columnName].sortable) return;

      const currentSortOrder = sortSignal.value[columnName];
      if (!currentSortOrder || currentSortOrder === SortOrder.DESC) {
        sortSignal.value = { [columnName]: SortOrder.ASC };
      } else {
        sortSignal.value = { [columnName]: SortOrder.DESC };
      }

      // Reset the page to the first page when sorting
      currentPage.value = 1;
    });

  return (
    <div>
      <div class="block sm:float-left sm:w-1/3 sm:pt-0 pt-2 w-1/2 mx-auto">
        <FilterInput filter={filter} onInput={onFilterInputChange} />
      </div>
      <div class="block sm:float-right sm:pt-0 pt-2 mx-auto">
        <Slot />
      </div>
      {isLoading.value ? ( // Show loader covering the entire table
        <div class="pt-14 animate-pulse">
          <div class="h-4 bg-base-200 mb-6 mt-2 rounded"></div>
          {Array.from({ length: limit.value + 2 }).map((_value, idx) => (
            <div key={idx} class="h-4 bg-base-200 mb-6 rounded"></div>
          ))}
        </div>
      ) : (
        <>
          <div class="overflow-x-scroll sm:contents">
            <table id="table" class="table table-zebra table-auto w-full whitespace-nowrap">
              <thead>
                <tr>
                  {Object.keys(props.columns).map((columnName, idx) => {
                    if (props.columns[columnName].hide) return;
                    return (
                      <th class={props.columns[columnName].headerClassNames ?? ''} onClick$={sortColumn(columnName)} key={idx}>
                        {props.columns[columnName].displayName ?? columnName}{' '}
                        {props.columns[columnName].sortable &&
                          (!sortSignal.value[columnName] ? (
                            <HiChevronUpDownOutline class="inline align-text-bottom text-base" />
                          ) : sortSignal.value[columnName] === SortOrder.ASC ? (
                            <HiChevronUpOutline class="inline align-text-bottom" />
                          ) : (
                            <HiChevronDownOutline class="inline align-text-bottom" />
                          ))}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody class={`${tableData.value.total === 0 ? 'h-[50vh]' : ''}`}>
                {tableData.value.total === 0 && (
                  <tr>
                    <td class="text-center" colSpan={Object.keys(props.columns).length}>
                      <span class="text-3xl">🦄</span>
                      <span class="block text-lg">There is no data to display, try changing the filter.</span>
                      <span class="block text-sm">Here's a unicorn to cheer you up</span>
                    </td>
                  </tr>
                )}
                {tableData.value.data.map((row, rowIndex) => (
                  <tr key={row.id as string}>
                    {Object.keys(props.columns).map((columnName, idx) => {
                      if (props.columns[columnName].hide) {
                        return;
                      }

                      const rawValue = row[columnName];
                      const value = !rawValue ? '' : rawValue.toString();
                      const format = props.columns[columnName].format;

                      return (
                        <td class={props.columns[columnName]?.tdClassNames ?? ''} key={idx}>
                          {format ? format({ value, row }) : value}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div class="flex flex-col sm:flex-row pt-5 justify-between">
            <div class="flex text-sm sm:mx-0 mx-auto">
              <EntriesSelector pageSize={limit} pageSizeOptions={props.pageSizeOptions} />
            </div>
            <div class="flex text-sm sm:mx-0 mx-auto sm:pt-0 pt-3">
              <PaginationActions
                tableData={tableData}
                limit={limit}
                page={currentPage}
                maxPages={maxPages}
                isOnFirstPage={isOnFirstPage}
                isOnLastPage={isOnLastPage}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
});
