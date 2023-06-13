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
import { hybridPaginationHook, PaginationFetcher } from '~/hooks/hybridPaginationHook';

export const serializeQueryUserPaginationParams = (paginationParams: PaginationParams) => {
  const paramsForQuery: { [key: string]: string } = {
    limit: '' + paginationParams.limit,
    page: '' + paginationParams.page,
  };
  if (paginationParams.filter) {
    paramsForQuery.filter = paginationParams.filter;
  }
  if (paginationParams.sortColumn && paginationParams.sort) {
    paramsForQuery[`sort[${paginationParams.sortColumn}]`] = paginationParams.sort;
  }

  return new URLSearchParams(paramsForQuery).toString().replace(/%5B/g, '[').replace(/%5D/g, ']');
};

export default component$(() => {
  const firstLoading = useStore({ value: true });

  const fetchUserData: PropFunction<PaginationFetcher> = $(
    async (paginationParams: PaginationParams) => {
      const headers = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      };

      const queryParams = serializeQueryUserPaginationParams(paginationParams);

      const data = await authorizedFetch(
        `${process.env.API_DOMAIN}/api/v1/users?${queryParams}`,
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
