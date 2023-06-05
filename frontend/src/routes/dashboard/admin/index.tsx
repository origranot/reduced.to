import { component$, useResource$, Resource, useVisibleTask$, useStore, $ } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';
import { ServerPaginatedDataTable } from '~/components/table/ServerPaginatedDataTable';
import { UserCtx } from '~/routes/layout';
import { authorizedFetch } from '~/shared/auth.service';
import { fetchMockUsers } from '~/mockdata/useMockFns';

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

export default component$(() => {
  const firstLoading = useStore({ value: true });
  const rowsCache = useStore({
    limit: 10,
    startIdx: 0,
    endIdx: 10,
    rows: [],
    sort: 'asc',
    sortColumn: 'id',
    filter: '',
    total: 0,
  });

  const fetchRows = $(async ({ limit, page, filter, sort, sortColumn }: PaginationParams) => {
    const startIdx = page * limit;
    const endIdx = startIdx + limit;

    const limitOnServer = 50;

    const isPageInRange = startIdx >= rowsCache.startIdx && endIdx <= rowsCache.endIdx;
    const isPageInLocalCache = isPageInRange && rowsCache.rows.length === rowsCache.total;

    // console.log('trying to fetch cached', {
    //   params: { limit, page, filter, sort, sortColumn },
    //   rowsCache: JSON.parse(JSON.stringify(rowsCache)),
    // });

    if (
      !isPageInLocalCache ||
      sortColumn !== rowsCache.sortColumn ||
      filter !== rowsCache.filter ||
      sort !== rowsCache.sort
    ) {
      const result = fetchMockUsers({ limit: limitOnServer, page, filter, sort, sortColumn });
      const payload = await result;

      rowsCache.filter = filter;
      rowsCache.sort = sort;
      rowsCache.sortColumn = sortColumn;
      rowsCache.limit = limit;
      rowsCache.startIdx = startIdx;
      rowsCache.endIdx = startIdx + limit - 1;
      rowsCache.total = payload.total;
      rowsCache.rows = payload.data as any;

      // console.log('caching...', { payload, rowsCache: JSON.parse(JSON.stringify(rowsCache)) });
    }

    const startIdxPartial = isPageInLocalCache ? startIdx - rowsCache.startIdx : 0;
    const endIdxPartial = isPageInLocalCache ? startIdxPartial + limit : limit;

    // console.log('cached', {
    //   limit,
    //   limitOnServer,
    //   endIdxPartial,
    //   startIdxPartial,
    //   startIdx,
    //   endIdx,
    //   page,
    // });

    return Promise.resolve({
      total: rowsCache.total,
      data: rowsCache.rows.slice(startIdxPartial, endIdxPartial),
    });
  });

  useVisibleTask$(
    () => {
      firstLoading.value = false;
    },
    { strategy: 'document-ready' }
  );

  const usersResource = useResource$<PaginatedRows<UserCtx>>(async ({ track, cleanup }) => {
    track(() => firstLoading.value);
    if (firstLoading.value) return;
    const abortController = new AbortController();
    cleanup(() => abortController.abort('cleanup'));

    const data = await authorizedFetch(`${process.env.API_DOMAIN}/api/v1/users?limit=10`, {
      signal: abortController.signal,
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    return await data.json();
  });

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
              total={total}
              emitFetchRows={fetchRows}
              customColumnNames={{ name: 'User-Name' }}
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
