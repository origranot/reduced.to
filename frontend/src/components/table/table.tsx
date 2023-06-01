import { component$, useStylesScoped$, useStore, JSXChildren } from '@builder.io/qwik';
import styles from './table.css?inline';
import {
  createTable,
  createColumnHelper,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  ColumnDef,
  getPaginationRowModel,
} from '@tanstack/table-core';

export interface TableProps<T extends string> {
  rows: Record<T, JSXChildren>[];
  customColumnNames?: Partial<Record<T, string>>;
}

export function generateUseTable<T>(columns: ColumnDef<T, unknown>[], rows: T[]) {
  const defaultTable = createTable({
    columns,
    data: [],
    state: {},
    renderFallbackValue: null,
    onStateChange: () => {},
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    //
    debugTable: true,
  });

  const useTable = (tableState: { sorting: SortingState }) =>
    createTable({
      columns,
      data: rows,
      state: { ...defaultTable.initialState, sorting: tableState.sorting },
      renderFallbackValue: 'fallback',
      onStateChange: (newState) => {
        if (typeof newState === 'function') {
          // TODO: newState might be a value rather than a function.
          tableState.sorting = newState(tableState as any /*tanstack ts issue*/).sorting;
        }
      },
      getSortedRowModel: getSortedRowModel(),
      getCoreRowModel: getCoreRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      //
      debugTable: true,
    });

  return useTable;
}

export const DataTable = component$(<T extends string>(props: TableProps<T>) => {
  useStylesScoped$(styles);

  const columnHelper = createColumnHelper<T>();
  const columns = Object.keys(props.rows[0]).map((colName: string) =>
    columnHelper.accessor(colName as any, {
      header: props.customColumnNames?.[colName as T] || colName,
    })
  );

  const state = useStore<{ sorting: SortingState }>({
    sorting: [],
  });

  const dataTable = generateUseTable(columns as ColumnDef<T, unknown>[], props.rows as T[])(state);

  return (
    <div class="overflow-x-auto">
      <table id="table" class="table table-zebra w-full">
        <thead>
          {dataTable.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(({ column }) => {
                const id = column.id;
                return (
                  <th
                    key={id}
                    onClick$$={(e) => {
                      console.log('🚀 ~ file: table.tsx:94 ~ {headerGroup.headers.map ~ e:', {
                        e,
                        id,
                      });

                      const table = generateUseTable(
                        columns as ColumnDef<T, unknown>[],
                        props.rows as T[]
                      )(state);

                      table.getColumn(id)?.getToggleSortingHandler?.()?.(e);
                    }}
                  >
                    {column.columnDef.header}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>

        <tbody>
          {dataTable.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getAllCells().map((cell) => (
                <td key={cell.id}>{cell.getValue<string>()}</td>
              ))}
            </tr>
          ))}
        </tbody>
        <tfoot>
          <div class="flex items-center gap-2">
            {/* first page */}
            <button
              class="border rounded p-1"
              onClick$={() => {
                const table = generateUseTable(
                  columns as ColumnDef<T, unknown>[],
                  props.rows as T[]
                )(state);
                console.log('🚀 ~ file: table.tsx:120 ~ table:', table);
                table.setPageIndex(0);
              }}
              disabled={!dataTable.getCanPreviousPage()}
            >
              {'<<'}
            </button>
            {/* prev page -1 */}
            <button
              class="border rounded p-1"
              onClick$={() => {
                const table = generateUseTable(
                  columns as ColumnDef<T, unknown>[],
                  props.rows as T[]
                )(state);
                table.previousPage();
              }}
              disabled={!dataTable.getCanPreviousPage()}
            >
              {'<'}
            </button>
            {/* next page +1 */}
            <button
              class="border rounded p-1"
              onClick$={() => {
                const table = generateUseTable(
                  columns as ColumnDef<T, unknown>[],
                  props.rows as T[]
                )(state);
                console.log('🚀 ~ file: table.tsx:149 ~ table:', table);
                table.nextPage();
              }}
              disabled={!dataTable.getCanNextPage()}
            >
              {'>'}
            </button>
            {/* last page */}
            <button
              class="border rounded p-1"
              onClick$={() => {
                const table = generateUseTable(
                  columns as ColumnDef<T, unknown>[],
                  props.rows as T[]
                )(state);
                table.setPageIndex(table.getPageCount() - 1);
              }}
              disabled={!dataTable.getCanNextPage()}
            >
              {'>>'}
            </button>
            <span class="flex items-center gap-1">
              <div>Page</div>
              <strong>
                {dataTable.getState().pagination.pageIndex + 1} of {dataTable.getPageCount()}
              </strong>
            </span>
            {/* <span class="flex items-center gap-1">
              | Go to page:
              <input
                type="number"
                value={table.getState().pagination.pageIndex + 1}
                onChange$={(e) => {
                  const page = e.target.value ? Number(e.target.value) - 1 : 0;
                  table.setPageIndex(page);
                }}
                class="border p-1 rounded w-16"
              />
            </span>
            <select
              value={table.getState().pagination.pageSize}
              onChange$={(e) => {
                table.setPageSize(Number(e.target.value));
              }}
            >
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <option value={pageSize}>Show {pageSize}</option>
              ))}
            </select> */}
          </div>
        </tfoot>
      </table>
    </div>
  );
});
