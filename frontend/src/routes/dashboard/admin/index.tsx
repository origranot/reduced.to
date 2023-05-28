import { component$, useStore, useResource$ } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';
import { DataTable } from '~/components/table/table';
import { authorizedFetch } from '~/shared/auth.service';

export const userMockData = [
  {
    id: '1abadc9c-2e8a-4c40-aa43-6f5f3af6f63d',
    name: 'John Smith',
    email: 'john@j.com',
    role: 'ADMIN',
    verified: true,
    verificationToken: 'eyJhbGciOiJIUzI1NiIs',
    refreshToken: '$2b$10$/VwWgAiRYqF6',
  },
  {
    id: '1abadc9c-2e8a-4c40-aa43-6f5f3af6f63d',
    name: 'Jane Doe',
    email: 'jane@j.com',
    role: 'USER',
    verified: true,
    verificationToken: 'eyJhbGciOiJIUzI1NiIs',
    refreshToken: '$2b$10$/VwWgAiRYqF6',
  },
];

export const fetchUsers = async () => {
  const data = await authorizedFetch(`${process.env.API_DOMAIN}/api/v1/users?limit=10`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  const result = await data.json();
  console.log('🚀 ~ file: index.tsx:31 ~ fetchUsers ~ result:', result);
  return result;
};

export default component$(() => {
  const users = useStore({ value: [] });

  useResource$(({ track }) => {
    track(() => users.value);

    fetchUsers();
  });

  return (
    <>
      <h1>Admin panel</h1>
      <p class="text-red-700">//TODO: Implement a table of users</p>
      <DataTable rows={userMockData} customColumnNames={{ name: 'User-Name' }} />
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
