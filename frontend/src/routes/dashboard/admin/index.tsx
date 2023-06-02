import { component$, useResource$, Resource, useVisibleTask$, useStore } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';
import { DataTable } from '~/components/table/table';
import { UserCtx } from '~/routes/layout';
import { authorizedFetch } from '~/shared/auth.service';

export const bullshit = [
  {
    ID: 'abadc9c-2e8a-4c40-aa43-6f5f3af6f63d',
    'USER-NAME': 'darkmift1',
    EMAIL: 'darkmift@dev.to',
    ROLE: 'ADMIN',
    VERIFIED: true,
  },
  {
    ID: 'abadc9c-2e8a-4c40-aa43-6f5f3af6f63d',
    'USER-NAME': 'darkmift2',
    EMAIL: 'darkmift@dev.to',
    ROLE: 'ADMIN',
    VERIFIED: true,
  },
  {
    ID: 'abadc9c-2e8a-4c40-aa43-6f5f3af6f63d',
    'USER-NAME': 'darkmift3',
    EMAIL: 'darkmift@dev.to',
    ROLE: 'ADMIN',
    VERIFIED: true,
  },
  {
    ID: 'abadc9c-2e8a-4c40-aa43-6f5f3af6f63d',
    'USER-NAME': 'darkmift',
    EMAIL: 'darkmift@dev.to',
    ROLE: 'ADMIN',
    VERIFIED: true,
  },
  {
    ID: 'abadc9c-2e8a-4c40-aa43-6f5f3af6f63d',
    'USER-NAME': 'darkmift',
    EMAIL: 'darkmift@dev.to',
    ROLE: 'ADMIN',
    VERIFIED: true,
  },
  {
    ID: 'abadc9c-2e8a-4c40-aa43-6f5f3af6f63d',
    'USER-NAME': 'darkmift',
    EMAIL: 'darkmift@dev.to',
    ROLE: 'ADMIN',
    VERIFIED: true,
  },
  {
    ID: 'abadc9c-2e8a-4c40-aa43-6f5f3af6f63d',
    'USER-NAME': 'darkmift',
    EMAIL: 'darkmift@dev.to',
    ROLE: 'ADMIN',
    VERIFIED: true,
  },
  {
    ID: 'abadc9c-2e8a-4c40-aa43-6f5f3af6f63d',
    'USER-NAME': 'darkmift',
    EMAIL: 'darkmift@dev.to',
    ROLE: 'ADMIN',
    VERIFIED: true,
  },
  {
    ID: 'abadc9c-2e8a-4c40-aa43-6f5f3af6f63d',
    'USER-NAME': 'darkmift',
    EMAIL: 'darkmift@dev.to',
    ROLE: 'ADMIN',
    VERIFIED: true,
  },
  {
    ID: 'abadc9c-2e8a-4c40-aa43-6f5f3af6f63d',
    'USER-NAME': 'darkmift',
    EMAIL: 'darkmift@dev.to',
    ROLE: 'ADMIN',
    VERIFIED: true,
  },
  {
    ID: 'abadc9c-2e8a-4c40-aa43-6f5f3af6f63d',
    'USER-NAME': 'darkmift',
    EMAIL: 'darkmift@dev.to',
    ROLE: 'ADMIN',
    VERIFIED: true,
  },
  {
    ID: 'abadc9c-2e8a-4c40-aa43-6f5f3af6f63d',
    'USER-NAME': 'darkmift',
    EMAIL: 'darkmift@dev.to',
    ROLE: 'ADMIN',
    VERIFIED: true,
  },
  {
    ID: 'abadc9c-2e8a-4c40-aa43-6f5f3af6f63d',
    'USER-NAME': 'darkmift',
    EMAIL: 'darkmift@dev.to',
    ROLE: 'ADMIN',
    VERIFIED: true,
  },
  {
    ID: 'abadc9c-2e8a-4c40-aa43-6f5f3af6f63d',
    'USER-NAME': 'darkmift',
    EMAIL: 'darkmift@dev.to',
    ROLE: 'ADMIN',
    VERIFIED: true,
  },
  {
    ID: 'abadc9c-2e8a-4c40-aa43-6f5f3af6f63d',
    'USER-NAME': 'darkmift',
    EMAIL: 'darkmift@dev.to',
    ROLE: 'ADMIN',
    VERIFIED: true,
  },
  {
    ID: 'abadc9c-2e8a-4c40-aa43-6f5f3af6f63d',
    'USER-NAME': 'darkmift',
    EMAIL: 'darkmift@dev.to',
    ROLE: 'ADMIN',
    VERIFIED: true,
  },
  {
    ID: 'abadc9c-2e8a-4c40-aa43-6f5f3af6f63d',
    'USER-NAME': 'darkmift',
    EMAIL: 'darkmift@dev.to',
    ROLE: 'ADMIN',
    VERIFIED: true,
  },
  {
    ID: 'abadc9c-2e8a-4c40-aa43-6f5f3af6f63d',
    'USER-NAME': 'darkmift',
    EMAIL: 'darkmift@dev.to',
    ROLE: 'ADMIN',
    VERIFIED: true,
  },
  {
    ID: 'abadc9c-2e8a-4c40-aa43-6f5f3af6f63d',
    'USER-NAME': 'darkmift',
    EMAIL: 'darkmift@dev.to',
    ROLE: 'ADMIN',
    VERIFIED: true,
  },
  {
    ID: 'abadc9c-2e8a-4c40-aa43-6f5f3af6f63d',
    'USER-NAME': 'darkmift',
    EMAIL: 'darkmift@dev.to',
    ROLE: 'ADMIN',
    VERIFIED: true,
  },
  {
    ID: 'abadc9c-2e8a-4c40-aa43-6f5f3af6f63d',
    'USER-NAME': 'darkmift',
    EMAIL: 'darkmift@dev.to',
    ROLE: 'ADMIN',
    VERIFIED: true,
  },
  {
    ID: 'abadc9c-2e8a-4c40-aa43-6f5f3af6f63d',
    'USER-NAME': 'darkmift',
    EMAIL: 'darkmift@dev.to',
    ROLE: 'ADMIN',
    VERIFIED: true,
  },
  {
    ID: 'abadc9c-2e8a-4c40-aa43-6f5f3af6f63d',
    'USER-NAME': 'darkmift',
    EMAIL: 'darkmift@dev.to',
    ROLE: 'ADMIN',
    VERIFIED: true,
  },
  {
    ID: 'abadc9c-2e8a-4c40-aa43-6f5f3af6f63d',
    'USER-NAME': 'darkmift',
    EMAIL: 'darkmift@dev.to',
    ROLE: 'ADMIN',
    VERIFIED: true,
  },
  {
    ID: 'abadc9c-2e8a-4c40-aa43-6f5f3af6f63d',
    'USER-NAME': 'darkmift',
    EMAIL: 'darkmift@dev.to',
    ROLE: 'ADMIN',
    VERIFIED: true,
  },
  {
    ID: 'abadc9c-2e8a-4c40-aa43-6f5f3af6f63d',
    'USER-NAME': 'darkmift',
    EMAIL: 'darkmift@dev.to',
    ROLE: 'ADMIN',
    VERIFIED: true,
  },
  {
    ID: 'abadc9c-2e8a-4c40-aa43-6f5f3af6f63d',
    'USER-NAME': 'darkmift',
    EMAIL: 'darkmift@dev.to',
    ROLE: 'ADMIN',
    VERIFIED: true,
  },
  {
    ID: 'abadc9c-2e8a-4c40-aa43-6f5f3af6f63d',
    'USER-NAME': 'darkmift',
    EMAIL: 'darkmift@dev.to',
    ROLE: 'ADMIN',
    VERIFIED: true,
  },
  {
    ID: '2badf9c-2e8a-4c40-aa43-6f5f3af6f63e',
    'USER-NAME': 'lightmift',
    EMAIL: 'lightmift@dev.to',
    ROLE: 'USER',
    VERIFIED: false,
  },
  {
    ID: '3cadc9c-2e8a-4c40-aa43-6f5f3af6f63f',
    'USER-NAME': 'redmift',
    EMAIL: 'redmift@dev.to',
    ROLE: 'USER',
    VERIFIED: true,
  },
  {
    ID: '4dadc9c-2e8a-4c40-aa43-6f5f3af6f63g',
    'USER-NAME': 'bluemift',
    EMAIL: 'bluemift@dev.to',
    ROLE: 'ADMIN',
    VERIFIED: false,
  },
  {
    ID: '5eadc9c-2e8a-4c40-aa43-6f5f3af6f63h',
    'USER-NAME': 'greenmift',
    EMAIL: 'greenmift@dev.to',
    ROLE: 'USER',
    VERIFIED: true,
  },
  {
    ID: '6fadc9c-2e8a-4c40-aa43-6f5f3af6f63i',
    'USER-NAME': 'purplemift',
    EMAIL: 'purplemift@dev.to',
    ROLE: 'ADMIN',
    VERIFIED: false,
  },
  {
    ID: '7gadc9c-2e8a-4c40-aa43-6f5f3af6f63j',
    'USER-NAME': 'yellowmift',
    EMAIL: 'yellowmift@dev.to',
    ROLE: 'USER',
    VERIFIED: true,
  },
  {
    ID: '8hadc9c-2e8a-4c40-aa43-6f5f3af6f63k',
    'USER-NAME': 'orangemift',
    EMAIL: 'orangemift@dev.to',
    ROLE: 'ADMIN',
    VERIFIED: false,
  },
  {
    ID: '9iadc9c-2e8a-4c40-aa43-6f5f3af6f63l',
    'USER-NAME': 'pinkmift',
    EMAIL: 'pinkmift@dev.to',
    ROLE: 'USER',
    VERIFIED: true,
  },
  {
    ID: '10jadc9c-2e8a-4c40-aa43-6f5f3af6f63m',
    'USER-NAME': 'graymift',
    EMAIL: 'graymift@dev.to',
    ROLE: 'ADMIN',
    VERIFIED: false,
  },
];

export default component$(() => {
  // const limit = useSignal<number>(0);
  const firstLoading = useStore({ value: true });

  useVisibleTask$(
    () => {
      firstLoading.value = false;
    },
    { strategy: 'document-ready' }
  );

  const usersResource = useResource$<UserCtx[]>(async ({ track, cleanup }) => {
    track(() => firstLoading.value);
    if (firstLoading.value) return;
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
    <div class="p-10">
      <h1>Admin panel</h1>

      <Resource
        value={usersResource}
        onPending={() => <p>Loading...</p>}
        onRejected={() => <p>Failed to fetch users data</p>}
        onResolved={(users) => {
          if (!users?.length) return <p>Failed to fetch users data</p>;
          return <DataTable rows={bullshit} customColumnNames={{ ['USER-NAME']: 'UserName' }} />;
          // return <DataTable rows={users} customColumnNames={{ name: 'User-Name' }} />;
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
