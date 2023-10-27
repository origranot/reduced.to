import { component$, useSignal, $, PropFunction, useResource$, QwikChangeEvent, Resource, JSXChildren } from '@builder.io/qwik';
import { FilterInput } from './default-filter';
import { authorizedFetch } from '../../shared/auth.service';

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

export type PaginationFetcher = ({ limit, page, filter, sort }: PaginationParams) => Promise<ResponseTableData>;

export type OptionalHeader = {
  displayName?: string;
  hide?: boolean;
};

export type Columns = Record<string, OptionalHeader>;

export interface TableServerPaginationParams {
  endpoint: string;
  columns: Columns;
  pageSize?: number;
}

export interface ResponseTableData {
  total: number;
  data: Record<string, unknown>[];
}

// TODO: Replace all of this with param builder
export const serializeQueryUserPaginationParams = (paginationParams: PaginationParams) => {
  const paramsForQuery: { [key: string]: string } = {
    limit: '' + paginationParams.limit,
    page: '' + paginationParams.page,
  };
  if (paginationParams.filter) {
    paramsForQuery.filter = paginationParams.filter;
  }

  if (paginationParams.sort) {
    Object.keys(paginationParams.sort).forEach((key) => {
      paramsForQuery[`sort[${key}]`] = paginationParams.sort[key];
    });
  }

  return new URLSearchParams(paramsForQuery).toString().replace(/%5B/g, '[').replace(/%5D/g, ']');
};

export const TableServerPagination = component$((props: TableServerPaginationParams) => {
  const filter = useSignal('');
  const currentPage = useSignal(1);
  const rowsPerPage = useSignal(10);
  const sortSignal = useSignal<Record<string, SortOrder>>({});

  const tableData = useSignal<ResponseTableData>({ total: 0, data: [] });
  const maxPages = useSignal(Math.ceil(tableData.value.total / rowsPerPage.value));

  const isOnFirstPage = currentPage.value === 1;
  const isOnLastPage = useResource$(async ({ track }) => {
    track(() => currentPage.value);
    track(() => maxPages.value);
    return currentPage.value === maxPages.value - 1;
  });

  const setPageNumber = $(async (mode: 'prev' | 'next') => {
    switch (mode) {
      case 'prev':
        if (currentPage.value === 1) return;
        currentPage.value = currentPage.value - 1;
        break;
      case 'next':
        if (currentPage.value >= maxPages.value - 1) return;
        currentPage.value = currentPage.value + 1;
        break;
    }
  });

  const fetchTableData: PropFunction<PaginationFetcher> = $(async (paginationParams: PaginationParams) => {
    paginationParams.page = paginationParams.page + 1;
    const queryParams = serializeQueryUserPaginationParams(paginationParams);
    const data = await authorizedFetch(`${props.endpoint}?${queryParams}`);
    const response = (await data.json()) as ResponseTableData;
    if (!response || !response.data) {
      console.warn('Server response is not valid', response);

      response.total = 0;
      response.data = [];
    }
    return response;
  });

  const paginatedRows = useResource$(async ({ track }) => {
    track(() => currentPage.value);
    track(() => rowsPerPage.value);
    track(() => filter.value);
    track(() => sortSignal.value);

    const result = await fetchTableData({
      page: currentPage.value,
      limit: rowsPerPage.value,
      filter: filter.value,
      sort: sortSignal.value,
    });

    return result;
  });

  return (
    <div class="flex flex-col justify-start">
      <FilterInput filter={filter} />
      <table id="table" class="table table-zebra w-full">
        <thead>
          <tr>
            {Object.keys(props.columns).map((columnName, idx) => {
              if (props.columns[columnName].hide) return;
              return <th key={idx}>{props.columns[columnName].displayName ?? columnName}</th>;
            })}
          </tr>
        </thead>

        <Resource
          value={paginatedRows}
          onPending={() => <p>Loading...</p>}
          onResolved={({ data, total }) => {
            // update signal for total count
            maxPages.value = Math.ceil(total / rowsPerPage.value);

            const filteredData = (data as unknown as Record<string, JSXChildren>[]).map((row) => {
              return Object.keys(row).reduce((acc: { [key: string]: unknown }, k) => {
                const key = k as string;
                console.log(props.columns[key]);
                if (!props.columns[key] || props.columns[key].hide) return acc;
                acc[k] = row[key];
                return acc;
              }, {});
            });

            console.log('filteredData', filteredData);
            return (
              <tbody>
                {/* ts inference bug atm with useresource */}
                {filteredData.map((row) => (
                  <tr>
                    {(Object.values(row) as JSXChildren[]).map((cell) => (
                      <td>{cell?.toString()}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            );
          }}
        />

        <tfoot>
          <tr>
            <td colSpan={100}>
              <div class="flex gap-2">
                {/* first page */}
                <button
                  class="btn border rounded p-1 "
                  onClick$={async () => {
                    currentPage.value = 1;
                  }}
                  disabled={isOnFirstPage}
                >
                  {'<<'}
                </button>
                {/* prev page -1 */}
                <button
                  class="btn border rounded p-1"
                  onClick$={() => {
                    setPageNumber('prev');
                  }}
                  disabled={isOnFirstPage}
                >
                  {'<'}
                </button>
                {/* next page +1 */}
                <button
                  class="btn border rounded p-1"
                  onClick$={async () => {
                    setPageNumber('next');
                  }}
                  disabled={!!isOnLastPage}
                >
                  {'>'}
                </button>
                {/* last page */}
                <button
                  class="btn border rounded p-1"
                  onClick$={async () => {
                    currentPage.value = maxPages.value - 1;
                  }}
                  disabled={!!isOnLastPage}
                >
                  {'>>'}
                </button>
                {/* pages of totalpages */}
                <span class="flex items-center gap-1">
                  <div>Page</div>
                  <strong>
                    {currentPage.value} of {maxPages.value}
                  </strong>
                </span>
                {/* rowsperpage select */}
                <select
                  value={rowsPerPage.value}
                  onChange$={(ev: QwikChangeEvent<HTMLSelectElement>) => {
                    rowsPerPage.value = +ev.target.value;
                  }}
                  class="select-text px-2 mx-3 rounded-md"
                >
                  {[10, 20, 30, 40, 50].map((pageSize) => (
                    <option value={pageSize}>{'Show ' + pageSize}</option>
                  ))}
                </select>
              </div>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
});
