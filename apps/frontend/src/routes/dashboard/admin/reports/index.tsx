import { component$, $ } from '@builder.io/qwik';
import { Columns, TableServerPagination } from '../../../../components/dashboard/table/table-server-pagination';
import { DocumentHead } from '@builder.io/qwik-city';
import { formatDate } from '../../../../lib/date-utils';

export default component$(() => {
  const columns: Columns = {
    key: { displayName: 'Shortened URL', classNames: 'w-1/4' },
    url: { displayName: 'Destination URL', classNames: 'w-1/4' },
    category: { displayName: 'Category', classNames: 'w-1/4' },
    createdAt: {
      displayName: 'Created At',
      classNames: 'w-1/4',
      sortable: true,
      format: $((value: string) => {
        return formatDate(new Date(value));
      }),
    },
    actions: {
      displayName: '',
      classNames: 'w-1/4',
      format: $((value: string) => {
        return (
          <>
            <button class="btn btn-sm btn-error">Delete</button>
          </>
        );
      }),
    },
  };

  return (
    <>
      <div class="rounded-xl w-full p-5">
        <TableServerPagination endpoint={`${process.env.CLIENTSIDE_API_DOMAIN}/api/v1/reports`} columns={columns} />
      </div>
    </>
  );
});

export const head: DocumentHead = {
  title: 'Reduced.to | Admin Dashboard - Reports',
  meta: [
    {
      name: 'title',
      content: 'Reduced.to | Admin Dashboard - Reports',
    },
    {
      name: 'description',
      content: 'Reduced.to | Admin Dashboard - See all reports',
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
      content: 'Reduced.to | Admin Dashboard - Reports',
    },
    {
      property: 'og:description',
      content: 'Reduced.to | Admin Dashboard - See all reports',
    },
    {
      property: 'twitter:card',
      content: 'summary',
    },
    {
      property: 'twitter:title',
      content: 'Reduced.to | Admin Dashboard - Reports',
    },
    {
      property: 'twitter:description',
      content: 'Reduced.to | Admin Dashboard - See all reports',
    },
  ],
};
