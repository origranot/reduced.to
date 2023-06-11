import {
  component$,
  useResource$,
  Resource,
  useVisibleTask$,
  useStore,
  $,
  PropFunction,
} from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';
import { UserCtx } from '~/routes/layout';
import { authorizedFetch } from '~/shared/auth.service';
import type {
  PaginatedRows,
  PaginationParams,
} from '~/components/table/server-paginated-data-table';
import { ServerPaginatedDataTable } from '~/components/table/server-paginated-data-table';

export interface LocalPaginationCache {
  limit: number;
  startIdx: number;
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

export const serializeQueryUserPaginationParams = (paginationParams: PaginationParams) => {
  const paramsForQuery = {
    limit: '' + paginationParams.limit,
    filter: paginationParams.filter,
    page: '' + paginationParams.page,
    [`sort[${paginationParams.sortColumn}]`]: paginationParams.sort,
  };

  return new URLSearchParams(paramsForQuery).toString().replace(/%5B/g, '[').replace(/%5D/g, ']');
};

export const hybridPaginationHook = (fetchRows: PropFunction<PaginationFetcher>) => {
  const rowsCache = useStore<LocalPaginationCache>({
    limit: 10,
    startIdx: 0,
    endIdx: 10,
    cachedPages: [],
    sort: null,
    sortColumn: null,
    filter: '',
    total: 0,
  });

  const fetchRowsHandler = $(
    async ({ limit, page, filter, sort, sortColumn }: PaginationParams) => {
      const startIdx = page * limit;
      const endIdx = startIdx + limit;
      const serverLimit = 100;

      const targetCachedPage = rowsCache.cachedPages.find((cachedPage) => {
        const { rangeStart, rangeEnd } = cachedPage;
        return startIdx >= rangeStart && endIdx <= rangeEnd;
      });

      if (
        Array.isArray(targetCachedPage) === false ||
        sortColumn !== rowsCache.sortColumn ||
        filter !== rowsCache.filter ||
        sort !== rowsCache.sort ||
        limit !== rowsCache.limit
      ) {
        rowsCache.cachedPages = [];

        const result = fetchRows({
          limit: serverLimit,
          page,
          filter,
          sort,
          sortColumn,
        });
        const payload = await result;
        console.log('🚀 ~ file: index.tsx:53 ~ fetchRows ~ result:', payload);

        rowsCache.total = payload.total;
        rowsCache.cachedPages.push({
          rangeStart: page * limit,
          rangeEnd: startIdx + limit,
          rows: payload.data as any,
        });
      }

      rowsCache.filter = filter;
      rowsCache.limit = limit;
      rowsCache.sort = sort;
      rowsCache.sortColumn = sortColumn;
      rowsCache.limit = limit;
      rowsCache.startIdx = startIdx;
      rowsCache.endIdx = startIdx + limit - 1;

      const startIdxPartial = startIdx - rowsCache.startIdx;
      const endIdxPartial = startIdxPartial + limit;

      return Promise.resolve({
        totalRowCount: rowsCache.total,
        data: targetCachedPage?.rows.slice(startIdxPartial, endIdxPartial),
      });
    }
  );

  return { fetchRowsHandler };
};

export default component$(() => {
  const firstLoading = useStore({ value: true });

  const fetchUserData: PropFunction<PaginationFetcher> = $(
    async (paginationParams: PaginationParams) => {
      const headers = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      };

      const data = await authorizedFetch(
        `${process.env.API_DOMAIN}/api/v1/users?${serializeQueryUserPaginationParams(
          paginationParams
        )}`,
        headers
      );
      return await data.json();
    }
  );

  const { fetchRowsHandler } = hybridPaginationHook(fetchUserData);

  useVisibleTask$(
    () => {
      firstLoading.value = false;
    },
    { strategy: 'document-ready' }
  );

  const usersResource = useResource$<{ data: PaginatedRows<UserCtx>; total: number }>(
    async ({ track, cleanup }) => {
      track(() => firstLoading.value);
      if (firstLoading.value) return;
      const abortController = new AbortController();
      cleanup(() => abortController.abort('cleanup'));

      const data = await authorizedFetch(
        `${process.env.API_DOMAIN}/api/v1/users?limit=10&sort[name]=asc`,
        {
          signal: abortController.signal,
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }
      );
      return await data.json();
    }
  );

  return (
    <div class="p-10">
      <h1>Admin panel</h1>

      <Resource
        value={usersResource}
        onPending={() => <p>Loading...</p>}
        onRejected={() => <p>Failed to fetch users data</p>}
        onResolved={(payload) => {
          if (!Array.isArray(payload?.data)) return <p>Failed to fetch users data</p>;
          const { data, total } = payload;
          return (
            <ServerPaginatedDataTable
              rows={data}
              totalRowCount={total}
              emitFetchRows={fetchRowsHandler as any} //TODO check type issue
              customColumnNames={{
                id: { name: 'id', hide: true },
                name: { name: 'name', customName: 'User-Name' },
              }}
            />
          );
        }}
      />
    </div>
  );
});

export const head: DocumentHead = {
  title: 'Reduced.to | Admin panel',
  meta: [
    {
      name: 'title',
      content: 'Reduced.to | Admin panel',
    },
    {
      name: 'description',
      content: 'Reduced.to | Admin panel, see other users, and more!',
    },
    {
      property: 'og:type',
      content: 'website',
    },
    {
      property: 'og:url',
      content: 'https://reduced.to/dashboard/admin',
    },
    {
      property: 'og:title',
      content: 'Reduced.to | Admin panel',
    },
    {
      property: 'og:description',
      content: 'Reduced.to | Admin panel, see other users, and more!',
    },
    {
      property: 'twitter:card',
      content: 'summary',
    },
    {
      property: 'twitter:title',
      content: 'Reduced.to | Admin panel',
    },
    {
      property: 'twitter:description',
      content: 'Reduced.to | Admin panel, see other users, and more!',
    },
  ],
};
