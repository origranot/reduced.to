import { component$, $, useSignal } from '@builder.io/qwik';
import { DocumentHead, globalAction$, z, zod$ } from '@builder.io/qwik-city';
import { HiPlusOutline } from '@qwikest/icons/heroicons';
import { Columns, SortOrder, TableServerPagination } from '../../components/dashboard/table/table-server-pagination';
import { LINK_MODAL_ID, LinkModal } from '../../components/dashboard/links/link-modal/link-modal';
import { formatDate } from '../../lib/date-utils';
import { useToaster } from '../../components/toaster/toaster';
import { getLinkFromKey } from '../../components/temporary-links/utils';
import { DELETE_CONFIRMATION, DELETE_MODAL_ID, DeleteModal } from '../../components/dashboard/delete-modal/delete-modal';
import { ACCESS_COOKIE_NAME } from '../../shared/auth.service';
import { HiEllipsisVerticalOutline, HiPencilSquareOutline, HiTrashOutline, HiArrowTopRightOnSquareOutline } from '@qwikest/icons/heroicons';

const useDeleteLink = globalAction$(
  async ({ idToDelete }, { fail, cookie, redirect }) => {
    const response: Response = await fetch(`${process.env.API_DOMAIN}/api/v1/links/${idToDelete}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${cookie.get(ACCESS_COOKIE_NAME)?.value}`,
      },
    });

    const data = await response.json();

    if (response.status !== 200) {
      return fail(data?.statusCode || 500, {
        message: data?.message,
      });
    }
  },
  zod$({
    idToDelete: z.string(),
    confirmation: z
      .string({
        required_error: `Please type ${DELETE_CONFIRMATION} to confirm.`,
      })
      .refine((val) => val === DELETE_CONFIRMATION, {
        message: `Please type ${DELETE_CONFIRMATION} to confirm.`,
      }),
  })
);
export default component$(() => {
  const refetchSignal = useSignal<number>(0);
  const toaster = useToaster();
  const deleteAction = useDeleteLink();
  const idToDelete = useSignal('');

  const onSubmitHandler = $(() => {
    refetchSignal.value++;

    toaster.add({
      title: 'Link created',
      description: 'Link created successfully and ready to use!',
      type: 'info',
    });
  });

  const columns: Columns = {
    key: {
      displayName: 'Shortened URL',
      headerClassNames: 'flex-grow',
      format: $(({ value }) => {
        const url = getLinkFromKey(value as string);
        return (
          <a href={url} target="_blank" rel="noopener noreferrer" class="text-blue-500 hover:underline">
            {process.env.DOMAIN}/{value}
          </a>
        );
      }),
    },
    url: {
      displayName: 'Destination URL',
      headerClassNames: 'flex-grow',
      format: $(({ value }) => {
        const limitLink = (limit: number) => (value.length > limit ? value.slice(0, limit) + '...' : value);
        return (
          <a
            style={'overflow-wrap:anywhere'}
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            data-tip={limitLink(150)}
            class="tooltip tooltip-bottom text-blue-500 hover:underline whitespace-pre-line text-left"
          >
            <p class="whitespace-nowrap">{limitLink(30)}</p>
          </a>
        );
      }),
    },
    createdAt: {
      displayName: 'Created At',
      headerClassNames: 'flex-grow',
      sortable: true,
      format: $(({ value }) => {
        return formatDate(new Date(value));
      }),
    },
    expirationTime: {
      displayName: 'Expiration Time',
      headerClassNames: 'flex-grow',
      sortable: true,
      format: $(({ value }) => {
        return value ? formatDate(new Date(value)) : '';
      }),
    },
    id: {
      displayName: '',
      headerClassNames: 'w-1/8',
      tdClassNames: 'text-left',
      format: $(({ value, row }) => {
        const url = getLinkFromKey(row.key);
        return (
          <div class="dropdown dropdown-bottom dropdown-end">
            <div tabIndex={0} role="button" class="btn btn-ghost btn-circle m-1">
              <HiEllipsisVerticalOutline class="w-5 h-5" />
            </div>
            <ul tabIndex={0} class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-30 text-left">
              <li>
                <a href={url} target="_blank" rel="noopener noreferrer">
                  <HiArrowTopRightOnSquareOutline class="w-5 h-5" />
                  Open
                </a>
                <a class="!cursor-not-allowed">
                  <HiPencilSquareOutline class="w-5 h-5" />
                  <span class="font-medium">Edit</span>
                  <span class="badge badge-primary">Soon</span>
                </a>
                <a
                  class="text-red-500"
                  onClick$={() => {
                    idToDelete.value = value;
                    (document.getElementById('delete-modal') as any).showModal();
                  }}
                >
                  <HiTrashOutline class="w-5 h-5" />
                  Delete
                </a>
              </li>
            </ul>
          </div>
        );
      }),
    },
  };

  const defaultSort = { createdAt: SortOrder.DESC };

  return (
    <>
      <DeleteModal
        onSubmitHandler={$(() => {
          refetchSignal.value++;
        })}
        idToDelete={idToDelete.value}
        id={DELETE_MODAL_ID}
        confirmation="DELETE"
        type="link"
        action={deleteAction}
      />
      <LinkModal onSubmitHandler={onSubmitHandler} />
      <div class="shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-xl w-full p-5">
        <TableServerPagination
          endpoint={`${process.env.CLIENTSIDE_API_DOMAIN}/api/v1/links`}
          columns={columns}
          defaultSort={defaultSort}
          refetch={refetchSignal}
        >
          <button class="btn btn-primary" onClick$={() => (document.getElementById(LINK_MODAL_ID) as any).showModal()}>
            <HiPlusOutline class="h-5 w-5" />
            Create a link
          </button>
        </TableServerPagination>
      </div>
    </>
  );
});

export const head: DocumentHead = {
  title: 'Reduced.to | Dashboard',
  meta: [
    {
      name: 'title',
      content: 'Reduced.to | Dashboard - My links',
    },
    {
      name: 'description',
      content: 'Reduced.to | Your links page. see your links, shorten links, and more!',
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
      content: 'Reduced.to | Dashboard - My links',
    },
    {
      property: 'og:description',
      content: 'Reduced.to | Your links page. see your links, shorten links, and more!',
    },
    {
      property: 'twitter:card',
      content: 'summary',
    },
    {
      property: 'twitter:title',
      content: 'Reduced.to | Dashboard - My links',
    },
    {
      property: 'twitter:description',
      content: 'Reduced.to | Your links page. see your links, shorten links, and more!',
    },
  ],
};
