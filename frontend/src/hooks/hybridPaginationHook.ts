import { PropFunction, useStore, $ } from '@builder.io/qwik';
import { PaginationParams } from '~/components/table/server-paginated-data-table';
export interface LocalPaginationCache {
  limit: number;
  startIdx: number;
  page: number;
  endIdx: number;
  cachedPages: { rangeStart: number; rangeEnd: number; rows: any[] }[];
  sort: 'asc' | 'desc' | null;
  sortColumn: string | null;
  filter: string;
  total: number;
}

export type PaginationFetcher = ({
  limit,
  page,
  filter,
  sort,
  sortColumn,
}: PaginationParams) => Promise<{
  data: unknown[];
  total: number;
}>;

export const inRange = (x: number, min: number, max: number) => (x - min) * (x - max) <= 0;

export const hybridPaginationHook = (fetchRows: PropFunction<PaginationFetcher>) => {
  const rowsCache = useStore<LocalPaginationCache>({
    limit: 10,
    page: 0,
    startIdx: 0,
    endIdx: 10,
    cachedPages: [],
    sort: null,
    sortColumn: null,
    filter: '',
    total: 0,
  });

  const setParams = $(({ limit, page, filter, sort, sortColumn }: PaginationParams) => {
    rowsCache.filter = filter;
    rowsCache.page = page;
    rowsCache.limit = limit;
    rowsCache.sort = sort;
    rowsCache.sortColumn = sortColumn;
    rowsCache.limit = limit;
  });

  const _findCache = $((startIdx: number, endIdx: number) =>
    rowsCache.cachedPages.find((cachedPage) => {
      const { rangeStart, rangeEnd } = cachedPage;
      return inRange(startIdx, rangeStart, rangeEnd) && inRange(endIdx, rangeStart, rangeEnd);
    })
  );

  const _setPageCache = $(
    async (serverLimit: number, { limit, page, filter, sort, sortColumn }: PaginationParams) => {
      const result = fetchRows({
        limit: serverLimit,
        page: Math.ceil((page * limit) / serverLimit),
        filter,
        sort,
        sortColumn,
      });
      const payload = await result;

      rowsCache.total = payload.total;

      const rangeStart = page * limit;
      rowsCache.cachedPages.push({
        rangeStart,
        rangeEnd: rangeStart + serverLimit,
        rows: payload.data as any,
      });
    }
  );

  const fetchRowsHandler = $(
    async ({ limit, page, filter, sort, sortColumn }: PaginationParams) => {
      const SERVER_LIMIT_SIZE = 100;
      const startIdx = page * limit;
      const endIdx = startIdx + limit;

      const targetCache = await _findCache(startIdx, endIdx);
      if (
        targetCache === undefined ||
        sortColumn !== rowsCache.sortColumn ||
        filter !== rowsCache.filter ||
        sort !== rowsCache.sort
      ) {
        rowsCache.cachedPages = [];
        await _setPageCache(SERVER_LIMIT_SIZE, { limit, page, filter, sort, sortColumn });
      }

      setParams({ limit, page, filter, sort, sortColumn });
      rowsCache.startIdx = startIdx;
      rowsCache.endIdx = endIdx;

      const startIdxPartial = (page * limit >= SERVER_LIMIT_SIZE ? page % 10 : page) * limit;
      const endIdxPartial = startIdxPartial + limit;

      const cachedPage = await _findCache(startIdx, endIdx);
      const payload = {
        totalRowCount: rowsCache.total,
        data: cachedPage?.rows.slice(startIdxPartial, endIdxPartial),
      };
      return Promise.resolve(payload);
    }
  );

  return { fetchRowsHandler };
};
