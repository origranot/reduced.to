import { component$, useResource$, Resource, useVisibleTask$, useStore, $ } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';
import { ServerPaginatedDataTable } from '~/components/table/ServerPaginatedDataTable';
import { UserCtx } from '~/routes/layout';
import { authorizedFetch } from '~/shared/auth.service';
import { fetchMockUsers } from '~/mockdata/useMockFns';
import { PaginatedRows, PaginationParams } from '~/types/paginated';

export const fetchRows = $(({ limit, page, filter, sort, sortColumn }: PaginationParams) => {
  const result = fetchMockUsers({ limit, page, filter, sort, sortColumn });
  result.then((d) => console.log({ result: d }));
  return result;
});

export default component$(() => {
  const firstLoading = useStore({ value: true });

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
