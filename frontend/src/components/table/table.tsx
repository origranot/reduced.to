import {
  component$,
  JSXChildren,
  useSignal,
  useComputed$,
  $,
  QwikChangeEvent,
} from '@builder.io/qwik';
import { FilterInput } from './DefaultFilter';

export interface TableProps<T extends string> {
  rows: Record<T, JSXChildren>[];
  customColumnNames?: Partial<Record<T, string>>;
}

export function paginateArray(array: unknown[], currentPage: number, pageSize: number): unknown[] {
  // PAGES START FROM 0 NOT 1
  // Calculate start and end index for the slice
  const start = currentPage * pageSize;
  const endIdx = start + pageSize;
  return structuredClone(array).slice(start, endIdx);
}

export const DataTable = component$(<T extends string>(props: TableProps<T>) => {
  const rowsPerPage = useSignal(10);
  const currentPage = useSignal(0);
  const filter = useSignal('');
  const sortColumn = useSignal(Object.keys(props.rows[0])[0]);
  const sortDesc = useSignal(true);

  const headers = Object.keys(props.rows[0]).map((colName) => ({
    name: colName,
    displayName: props.customColumnNames?.[colName as T] || colName,
  }));
  const filterSetter$ = $((val: string) => {
    filter.value = val;
  });
  const setSortParams = $((colName: string) => {
    sortColumn.value = colName;
    sortDesc.value = !sortDesc.value;
  });

  const computedRows = useComputed$(() => {
    const result = structuredClone(props.rows).filter((obj) => {
      return Object.values(obj).some((val) =>
        String(val).toLowerCase().includes(filter.value.toLowerCase())
      );
    });
    result.sort((a: any, b: any) => {
      return sortDesc.value
        ? ('' + b[sortColumn.value]).localeCompare(a[sortColumn.value])
        : ('' + a[sortColumn.value]).localeCompare(b[sortColumn.value]);
    });

    return result;
  });

  const paginatedRows = useComputed$(() => {
    const start = currentPage.value * rowsPerPage.value;
    const endIdx = start + rowsPerPage.value;
    return computedRows.value.slice(start, endIdx);
  });

  const maxPages = useComputed$(() => Math.ceil(computedRows.value.length / rowsPerPage.value));
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
    console.log('🚀 ~ file: table.tsx:78 ~ setPage ~ currentPage:', currentPage.value);
  });
  return (
    <div class="overflow-x-auto">
      <FilterInput filterValue={filter} setFilter$={filterSetter$} />
      <table id="table" class="table table-zebra w-full">
        <thead>
          <tr>
            {headers.map((headerName) => (
              <td onClick$={() => setSortParams(headerName.name)}>{headerName.displayName}</td>
            ))}
          </tr>
        </thead>

        <tbody>
          {paginatedRows.value.map((row) => (
            <tr>
              {(Object.values(row) as JSXChildren[]).map((cell) => (
                <td>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
        <tfoot>
          <div class="flex items-center gap-2">
            {/* first page */}
            <button
              class="btn border rounded p-1"
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
            <span class="flex items-center gap-1">
              <div>Page</div>
              <strong>
                {currentPage.value + 1} of {maxPages}
              </strong>
            </span>

            <span class="flex items-center gap-1">
              | Go to page:
              <input
                type="number"
                value={currentPage.value + 1}
                min="1"
                max={maxPages.value}
                onChange$={(e) => {
                  const page = e.target.value ? Number(e.target.value) - 1 : 0;
                  currentPage.value = page;
                }}
                class="border p-1 rounded w-16"
              />
            </span>
            <select
              value={rowsPerPage.value}
              onChange$={(ev: QwikChangeEvent<HTMLSelectElement>) => {
                rowsPerPage.value = +ev.target.value;
              }}
            >
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <option value={pageSize}>{'Show ' + pageSize}</option>
              ))}
            </select>
          </div>
        </tfoot>
      </table>
    </div>
  );
});
