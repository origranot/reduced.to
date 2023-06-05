import {
  component$,
  JSXChildren,
  useSignal,
  $,
  QwikChangeEvent,
  PropFunction,
  useResource$,
  Resource,
} from '@builder.io/qwik';
import { FilterInput } from './DefaultFilter';

export interface PaginatedRows<T> {
  data: T[];
  total: number;
}

export enum SortOrder {
  DESC = 'desc',
  ASC = 'asc',
}

export interface PaginationParams {
  limit: number;
  page: number;
  filter: string;
  sort: SortOrder;
  sortColumn: string;
}

export interface TableProps<T extends string> {
  rows: Record<T, JSXChildren>[];
  customColumnNames?: Partial<Record<T, string>>;
  total: number;
  rowsPerPage?: number;
  emitFetchRows: PropFunction<
    ({ page, limit, filter, sort, sortColumn }: PaginationParams) => Promise<{
      total: number;
      data: Record<T, JSXChildren>[];
    }>
  >;
}

export const ServerPaginatedDataTable = component$(<T extends string>(props: TableProps<T>) => {
  const rowsPerPage = useSignal(props.rowsPerPage || 10);
  const currentPage = useSignal(0);
  const filter = useSignal('');
  const sortColumn = useSignal<keyof T>(Object.keys(props.rows[0])[0] as keyof T);
  const sortDesc = useSignal(true);
  const maxPages = useSignal(props.total);

  const headers = Object.keys(props.rows[0]).map((colName) => ({
    name: colName,
    displayName: props.customColumnNames?.[colName as T] || colName,
  }));

  const filterSetter$ = $((val: string) => {
    filter.value = val;
  });

  const setSortParams = $((colName: keyof T) => {
    sortColumn.value = colName;
    sortDesc.value = !sortDesc.value;
  });

  const paginatedRows = useResource$(async ({ track }) => {
    track(() => currentPage.value);
    track(() => rowsPerPage.value);
    track(() => filter.value);
    track(() => sortDesc.value);
    track(() => sortColumn.value);

    const result = await props.emitFetchRows({
      page: currentPage.value,
      limit: rowsPerPage.value,
      filter: filter.value,
      sort: sortDesc.value ? SortOrder.DESC : SortOrder.ASC,
      sortColumn: sortColumn.value as string,
    });

    return result;
  });

  const isOnFirstPage = currentPage.value === 0;
  const isOnLastPage = currentPage.value === maxPages.value - 1;

  const setPageNumber = $((mode: 'prev' | 'next') => {
    switch (mode) {
      case 'prev':
        if (currentPage.value === 0) return;
        currentPage.value = currentPage.value - 1;
        break;
      case 'next':
        if (currentPage.value >= maxPages.value - 1) return;
        currentPage.value = currentPage.value + 1;
        break;
    }
  });

  return (
    <div class="flex flex-col justify-start">
      <FilterInput filterValue={filter} setFilter$={filterSetter$} />
      <table id="table" class="table table-zebra w-full">
        <thead>
          <tr>
            {headers.map((headerName) => (
              <td onClick$={() => setSortParams(headerName.name as keyof T)}>
                {headerName.displayName}
              </td>
            ))}
          </tr>
        </thead>

        <Resource
          value={paginatedRows}
          onPending={() => <p>Loading...</p>}
          onResolved={({ data, total }) => {
            maxPages.value = total;
            return (
              <tbody>
                {/* ts inference bug atm with useresource */}
                {(data as unknown as Record<T, JSXChildren>[]).map((row) => (
                  <tr>
                    {(Object.values(row) as JSXChildren[]).map((cell) => (
                      <td>{cell}</td>
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
                    currentPage.value = 0;
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
                  disabled={isOnLastPage}
                >
                  {'>'}
                </button>
                {/* last page */}
                <button
                  class="btn border rounded p-1"
                  onClick$={async () => {
                    currentPage.value = maxPages.value - 1;
                  }}
                  disabled={isOnLastPage}
                >
                  {'>>'}
                </button>
                {/* pages of totalpages */}
                <span class="flex items-center gap-1">
                  <div>Page</div>
                  <strong>
                    {currentPage.value + 1} of {maxPages.value}
                  </strong>
                </span>
                {/* got to page input */}
                <span class="flex items-center gap-2 mx-3">
                  <span>Go to page:</span>
                  <input
                    type="number"
                    value={currentPage.value + 1}
                    min="1"
                    max={maxPages.value}
                    onChange$={(e) => {
                      const page = e.target.value ? Number(e.target.value) - 1 : 0;
                      currentPage.value = page;
                    }}
                    // class="border p-1 rounded w-16"
                    class="input input-bordered w-full"
                  />
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
