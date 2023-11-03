import { component$, useSignal, useVisibleTask$, $ } from '@builder.io/qwik';
import { Columns, TableServerPagination } from '../../../../components/table/table-server-pagination';
import { DocumentHead } from '@builder.io/qwik-city';
import { authorizedFetch } from '../../../../shared/auth.service';
import { StatsCard, StatsCardValue } from '../../../../components/stats/stats-card';
import { formatDate, getMonthName } from '../../../../lib/date-utils';

export default component$(() => {
  const registeredUsersSignal = useSignal<StatsCardValue>({ loading: true });
  const newUsersSignal = useSignal<StatsCardValue>({ loading: true });
  const verifiedUsersSignal = useSignal<StatsCardValue>({ loading: true });

  const columns: Columns = {
    name: { displayName: 'Name', classNames: 'w-1/4', sortable: true },
    email: { displayName: 'Email', classNames: 'w-1/4', sortable: true },
    verified: { displayName: 'Verified', classNames: 'w-1/4' },
    createdAt: {
      displayName: 'Created At',
      classNames: 'w-1/4',
      sortable: true,
      format: $((value: string) => {
        return formatDate(new Date(value));
      }),
    },
  };

  const getRegisteredUsers = $(async () => {
    const lastMonthEndDate = new Date();
    lastMonthEndDate.setMonth(lastMonthEndDate.getMonth() - 1);

    const promises = await Promise.all([
      authorizedFetch(`${process.env.API_DOMAIN}/api/v1/users/count`),
      authorizedFetch(`${process.env.API_DOMAIN}/api/v1/users/count?startDate=${lastMonthEndDate}&endDate=${new Date()}`),
    ]);

    const [{ count: totalUsers }, { count: usersLastMonth }] = await Promise.all(promises.map((response) => response.json()));
    const change = ((totalUsers - usersLastMonth) / usersLastMonth) * 100;

    registeredUsersSignal.value = {
      loading: false,
      value: totalUsers.toString(),
      description: <span>{`${Math.abs(change).toFixed(1)}% ${change > 0 ? 'more' : 'less'} than last month`}</span>,
    };
  });

  const getNewUsers = $(async () => {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0); // Last day of the current month

    const response = await authorizedFetch(`${process.env.API_DOMAIN}/api/v1/users/count?startDate=${firstDayOfMonth}&endDate=${today}`);
    const { count } = await response.json();

    newUsersSignal.value = {
      loading: false,
      value: count.toString(),
      description: (
        <span>{`${getMonthName(firstDayOfMonth.getMonth())} ${firstDayOfMonth.getDate()} - ${getMonthName(
          lastDayOfMonth.getMonth()
        )} ${lastDayOfMonth.getDate()}`}</span>
      ),
    };
  });

  const getVerifiedUsers = $(async () => {
    const repsonse = await authorizedFetch(`${process.env.API_DOMAIN}/api/v1/users/count?verified=true`);
    const { count: verifiedUsersCount } = await repsonse.json();

    const totalUsers = parseInt(registeredUsersSignal.value.value!, 10);
    const notVerifiedUsersCount = totalUsers - verifiedUsersCount;

    const change = totalUsers === 0 ? 0 : ((verifiedUsersCount - notVerifiedUsersCount) / totalUsers) * 100;

    verifiedUsersSignal.value = {
      loading: false,
      value: verifiedUsersCount.toString(),
      description: <span>{`${Math.abs(change).toFixed(1)}% of the users are verified`}</span>,
    };
  });

  useVisibleTask$(async () => {
    await Promise.all([getRegisteredUsers(), getNewUsers()]);
    await getVerifiedUsers();
  });

  // Verified Users
  useVisibleTask$(async () => {});

  return (
    <>
      <div class="grid grid-cols-1 gap-5 sm:grid-cols-3 lg:grid-cols-3">
        <StatsCard title="Registered Users" data={registeredUsersSignal} />
        <StatsCard title="New Users" data={newUsersSignal} />
        <StatsCard title="Verified Users" data={verifiedUsersSignal} />
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
