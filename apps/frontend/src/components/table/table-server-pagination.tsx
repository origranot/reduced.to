import { component$, useSignal, $, PropFunction, useVisibleTask$ } from '@builder.io/qwik';
import { FilterInput } from './default-filter';
import { authorizedFetch } from '../../shared/auth.service';
import { PaginationActions } from './pagination-actions';

export enum SortOrder {
  DESC = 'desc',
  ASC = 'asc',
}

export interface PaginationParams {
  limit: number;
  page: number;
  filter: string;
  sort: Record<string, SortOrder>;
}

export type PaginationFetcher = ({ limit, page, filter, sort }: PaginationParams) => Promise<ResponseData>;

export type OptionalHeader = {
  displayName?: string;
  classNames?: string;
  hide?: boolean;
};

export type Columns = Record<string, OptionalHeader>;

export interface TableServerPaginationParams {
  endpoint: string;
  columns: Columns;
  pageSize?: number;
}

export interface ResponseData {
  total: number;
  data: Record<string, unknown>[];
}

export const serializeQueryUserPaginationParams = (paginationParams: PaginationParams) => {
  const paramsForQuery = new URLSearchParams();

  paramsForQuery.set('limit', paginationParams.limit.toString());
  paramsForQuery.set('page', paginationParams.filter ? '1' : paginationParams.page.toString());

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
  const limit = useSignal(10);
  const sortSignal = useSignal<Record<string, SortOrder>>({});
  const tableData = useSignal<ResponseData>({ total: 0, data: [] });
  const maxPages = useSignal(0);

  const isOnFirstPage = useSignal(true);
  const isOnLastPage = useSignal(true);

  const isLoading = useSignal(true);

  const fetchTableData: PropFunction<PaginationFetcher> = $(async (paginationParams: PaginationParams) => {
    paginationParams.page = paginationParams.page + 1;
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

  useVisibleTask$(async ({ track }) => {
    track(() => currentPage.value);
    track(() => limit.value);
    track(() => filter.value);
    track(() => sortSignal.value);

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
    isOnLastPage.value = currentPage.value >= maxPages.value - 1;

    isLoading.value = false;
  });

  return (
    <div class="flex flex-col justify-start">
      <FilterInput filter={filter} />
      {isLoading.value ? ( // Show loader covering the entire table
        <div class="animate-pulse">
          <div class="h-4 bg-gray-200 mb-6 mt-2 rounded"></div>
          {Array.from({ length: 12 }).map(() => (
            <div class="h-4 bg-gray-200 mb-6 rounded"></div>
          ))}
        </div>
      ) : (
        <table id="table" class="table table-zebra w-full">
          <thead>
            <tr>
              {Object.keys(props.columns).map((columnName, idx) => {
                if (props.columns[columnName].hide) return;
                return (
                  <th class={props.columns[columnName].classNames ?? ''} key={idx}>
                    {props.columns[columnName].displayName ?? columnName}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {tableData.value.data.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {Object.keys(props.columns).map((columnName, idx) => {
                  if (props.columns[columnName].hide) return;
                  return <td key={idx}>{row[columnName]?.toString()}</td>;
                })}
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <div class="flex pt-5">
                <PaginationActions
                  tableData={tableData}
                  limit={limit}
                  page={currentPage}
                  maxPages={maxPages}
                  isOnFirstPage={isOnFirstPage}
                  isOnLastPage={isOnLastPage}
                />
              </div>
            </tr>
          </tfoot>
        </table>
      )}
    </div>
  );
});
