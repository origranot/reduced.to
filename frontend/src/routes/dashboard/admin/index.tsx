import { component$, useResource$, Resource, useSignal } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';
import { DataTable } from '~/components/table/table';
import { UserCtx } from '~/routes/layout';
import { authorizedFetch } from '~/shared/auth.service';

export default component$(() => {
  const limit = useSignal<number>(0);

  const usersResource = useResource$<UserCtx[]>(async ({ track, cleanup }) => {
    track(() => limit.value);
    const abortController = new AbortController();
    cleanup(() => abortController.abort('cleanup'));

    const data = await authorizedFetch(`${process.env.API_DOMAIN}/api/v1/users?limit=10`, {
      signal: abortController.signal,
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    const result = await data.json();
    return result;
  });

  return (
    <>
      <h1>Admin panel</h1>

      <Resource
        value={usersResource}
        onPending={() => <p>Loading...</p>}
        onRejected={() => <p>Failed to fetch users data</p>}
        onResolved={(users) => {
          if (!users?.length) return <p>Failed to fetch users data</p>;
          return <DataTable rows={users} customColumnNames={{ name: 'User-Name' }} />;
        }}
      />
    </>
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
