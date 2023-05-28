import { component$, useStylesScoped$, useStore } from '@builder.io/qwik';
import styles from './table.css?inline';
import {
  createTable,
  createColumnHelper,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  ColumnDef,
} from '@tanstack/table-core';

// type RowType = { [key: string]: unknown };

export interface TableProps<T> {
  rows: T[];
  customColumnNames?: { [key in keyof T]?: string };
}

// export interface TableProps {
//   rows: RowType[];
//   customColumnNames?: { [key in keyof RowType]?: string };
// }

export function generateUseTable<T>(columns: ColumnDef<T, unknown>[], rows: T[]) {
  const defaultTable = createTable({
    columns,
    data: [],
    state: {},
    renderFallbackValue: null,
    onStateChange: () => {},
    getCoreRowModel: getCoreRowModel(),
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
    });

  return useTable;
}

export const DataTable = component$<TableProps<T>>((props: TableProps<T>) => {
  useStylesScoped$(styles);

  const columnHelper = createColumnHelper<T>();
  const columns = Object.keys(props.rows[0]).map((colName: string) =>
    columnHelper.accessor(colName, {
      header: props.customColumnNames?.[colName] || colName,
    })
  );

  const state = useStore<{ sorting: SortingState }>({
    sorting: [],
  });

  // const table = useTable(state);
  const table = generateUseTable(columns as ColumnDef<T, unknown>[], props.rows)(state);

  return (
    <div class="overflow-x-auto">
      <table id="table" class="table table-zebra w-full">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(({ column }) => {
                const id = column.id;
                return (
                  <th
                    key={id}
                    onClick$={(e) => {
                      console.log('🚀 ~ file: table.tsx:94 ~ {headerGroup.headers.map ~ e:', {
                        e,
                        id,
                      });

                      const table = generateUseTable(
                        columns as ColumnDef<T, unknown>[],
                        props.rows
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
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getAllCells().map((cell) => (
                <td key={cell.id}>{cell.getValue<string>()}</td>
              ))}
            </tr>
          ))}
        </tbody>
        <tfoot></tfoot>
      </table>
    </div>
  );
});
