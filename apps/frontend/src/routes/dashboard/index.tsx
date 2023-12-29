import {component$, $, useSignal, useStore} from '@builder.io/qwik';
import {DocumentHead, globalAction$, z, zod$} from '@builder.io/qwik-city';
import {HiPlusOutline} from '@qwikest/icons/heroicons';
import {Columns, SortOrder, TableServerPagination} from '../../components/dashboard/table/table-server-pagination';
import {LINK_MODAL_ID, LinkModal} from '../../components/dashboard/links/link-modal/link-modal';
import {formatDate} from '../../lib/date-utils';
import {useToaster} from '../../components/toaster/toaster';
import {getLinkFromKey} from '../../components/temporary-links/utils';
import {DeleteModal} from "../../components/dashboard/delete-modal/delete-modal";
import {DELETE_CONFIRMATION, DELETE_MODAL_ID} from "./settings";
import {ACCESS_COOKIE_NAME} from "../../shared/auth.service";

const useDeleteLink =  globalAction$(
  async ({id_to_delete}, {fail, cookie, redirect, }) => {
    const response: Response = await fetch(`${process.env.API_DOMAIN}/api/v1/links/${id_to_delete}`, {
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
    else
      throw redirect(301, '/')

  },
  zod$({

    id_to_delete: z.string( )
    ,
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
  const store = useStore({id_to_delete: ""});

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
      classNames: 'w-1/4',
      format: $(({value}) => {
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
      classNames: 'w-1/4',
      format: $(({value}) => {
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
    expirationTime: {
      displayName: 'Expiration Time',
      classNames: 'w-1/4',
      sortable: true,
      format: $(({value}) => {
        if (!value || value === '') {
          return 'Never';
        }

        return formatDate(new Date(value));
      }),
    },
    createdAt: {
      displayName: 'Created At',
      classNames: 'w-1/4',
      sortable: true,
      format: $(({value}) => {
        return formatDate(new Date(value));
      }),
    },
    id: {
      displayName: 'Action',
      classNames: 'w-1/4',
      format: $(({value}) => {
        return (
          <div class="dropdown dropdown-bottom ">
            <div tabIndex={0} role="button" class="btn m-1">

              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
              </svg>

            </div>
            <ul tabIndex={0} class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
              <li class="w-10 text-red-500  btn-error"><a onClick$={() => {

                (document.getElementById('delete-modal') as any).showModal()
                store.id_to_delete = value
                // deleteAction.value?.fieldErrors?.id= value
              }
              }>Delete
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg>

              </a></li>
            </ul>
          </div>
        );
      }),
    },
  };



  const defaultSort = {createdAt: SortOrder.DESC};

  return (
    <>
      <DeleteModal id_to_delete={store.id_to_delete} id={DELETE_MODAL_ID} confirmation="DELETE" type="link" action={deleteAction}/>
      <LinkModal onSubmitHandler={onSubmitHandler}/>
      <div class="shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-xl w-full p-5">
        <TableServerPagination
          endpoint={`${process.env.CLIENTSIDE_API_DOMAIN}/api/v1/links`}
          columns={columns}
          defaultSort={defaultSort}
          refetch={refetchSignal}
        >
          <button class="btn btn-primary" onClick$={() => (document.getElementById(LINK_MODAL_ID) as any).showModal()}>
            <HiPlusOutline class="h-5 w-5"/>
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
