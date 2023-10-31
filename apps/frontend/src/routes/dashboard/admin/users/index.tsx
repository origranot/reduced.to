import { component$, useSignal, useVisibleTask$ } from '@builder.io/qwik';
import { Columns, TableServerPagination } from '../../../../components/table/table-server-pagination';
import { DocumentHead } from '@builder.io/qwik-city';
import { authorizedFetch } from '../../../../shared/auth.service';
import { StatsCard, StatsCardValue } from '../../../../components/stats/stats-card';

export default component$(() => {
  const registeredUsersSignal = useSignal<StatsCardValue>({ loading: true });

  const columns: Columns = {
    name: { displayName: 'Name', classNames: 'w-1/4', sortable: true },
    email: { displayName: 'Email', classNames: 'w-1/4', sortable: true },
    verified: { displayName: 'Verified', classNames: 'w-1/4' },
    createdAt: { displayName: 'Created At', classNames: 'w-1/4', sortable: true },
  };

  // Registered Users
  useVisibleTask$(async () => {
    const response = await authorizedFetch(`${process.env.API_DOMAIN}/api/v1/users/count`);
    const { totalUsers, usersLastMonth } = await response.json();

    const change = Math.round(((totalUsers - usersLastMonth) / usersLastMonth) * 100);

    registeredUsersSignal.value = {
      loading: false,
      value: totalUsers.toString(),
      description: (
        <>
          <div class="stat-desc">
            <span>
              {change}
              {'% '}
              {change > 0 ? 'more than last month' : 'less than last month'}
            </span>
          </div>
        </>
      ),
    };
  });

  return (
    <>
      <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Registered Users" data={registeredUsersSignal} />
      </div>
      <div class="mt-5 shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-xl w-full p-5">
        <TableServerPagination endpoint={`${process.env.API_DOMAIN}/api/v1/users`} columns={columns} />
      </div>
    </>
  );
});

export const head: DocumentHead = {
  title: 'Reduced.to | Admin Dashboard - Users',
  meta: [
    {
      name: 'title',
      content: 'Reduced.to | Admin Dashboard - Users',
    },
    {
      name: 'description',
      content: 'Reduced.to | Admin Dashboard - See all users',
    },
    {
      property: 'og:type',
      content: 'website',
    },
    {
      property: 'og:url',
      content: 'https://reduced.to/dashboard',
    },
    {
      property: 'og:title',
      content: 'Reduced.to | Admin Dashboard - Users',
    },
    {
      property: 'og:description',
      content: 'Reduced.to | Admin Dashboard - See all users',
    },
    {
      property: 'twitter:card',
      content: 'summary',
    },
    {
      property: 'twitter:title',
      content: 'Reduced.to | Admin Dashboard - Users',
    },
    {
      property: 'twitter:description',
      content: 'Reduced.to | Admin Dashboard - See all users',
    },
  ],
};
