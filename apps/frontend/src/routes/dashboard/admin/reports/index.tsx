import { component$, $, useSignal } from '@builder.io/qwik';
import { Columns, TableServerPagination } from '../../../../components/dashboard/table/table-server-pagination';
import { DocumentHead } from '@builder.io/qwik-city';
import { formatDate } from '../../../../lib/date-utils';
import { useToaster } from '../../../../components/toaster/toaster';
import { authorizedFetch } from '../../../../shared/auth.service';
import { HiXCircleOutline } from '@qwikest/icons/heroicons';

export default component$(() => {
  const refetchSignal = useSignal<number>(0);
  const toaster = useToaster();

  const deleteReport = $(async (reportId: string, deleteLink: boolean) => {
    try {
      const response = await authorizedFetch(`${process.env.CLIENTSIDE_API_DOMAIN}/api/v1/reports/${reportId}?deleteLink=${deleteLink}`, {
        method: 'DELETE',
      });

      if (response.status !== 200) {
        throw new Error('Something went wrong');
      }

      const title = deleteLink ? 'Link deleted successfully' : 'Report deleted successfully';
      const description = deleteLink ? 'The link has been deleted successfully' : 'The report has been deleted successfully';

      refetchSignal.value++;
      toaster.add({
        title,
        description,
      });
    } catch (error: any) {
      toaster.add({
        title: 'Oops!',
        description: error.message,
        type: 'error',
      });
    }
  });

  const columns: Columns = {
    ignore: {
      displayName: '',
      classNames: 'w-1/9',
      format: $(({ row, value }) => {
        return (
          <>
            <button
              class="btn btn-sm btn-ghost"
              onClick$={async () => {
                await deleteReport(row.id, false);
              }}
            >
              <HiXCircleOutline class="h-5 w-5" />
            </button>
          </>
        );
      }),
    },
    key: {
      displayName: 'Shortened URL',
      classNames: 'w-1/4',
      format: $(({ row }) => {
        return `${process.env.DOMAIN}/${row.link.key}`;
      }),
    },
    url: {
      displayName: 'Destination URL',
      classNames: 'w-1/4',
      format: $(({ row }) => {
        return row.link.url;
      }),
    },
    category: { displayName: 'Category', classNames: 'w-1/4' },
    createdAt: {
      displayName: 'Created At',
      classNames: 'w-1/4',
      sortable: true,
      format: $(({ value }) => {
        return formatDate(new Date(value));
      }),
    },
    actions: {
      displayName: '',
      classNames: 'w-1/4',
      format: $(({ row, value }) => {
        return (
          <>
            <button
              class="btn btn-sm btn-error"
              onClick$={async () => {
                await deleteReport(row.id, true);
              }}
            >
              Delete Link
            </button>
          </>
        );
      }),
    },
  };

  return (
    <>
      <div class="rounded-xl w-full p-5">
        <TableServerPagination endpoint={`${process.env.CLIENTSIDE_API_DOMAIN}/api/v1/reports`} refetch={refetchSignal} columns={columns} />
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
