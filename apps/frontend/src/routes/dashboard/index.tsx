import { component$, useSignal, useVisibleTask$, $ } from '@builder.io/qwik';
import { DocumentHead } from '@builder.io/qwik-city';
import { LinkBlock } from '../../components/dashboard/links/link/link';
import { LINK_MODAL_ID, LinkModal } from '../../components/dashboard/links/link-modal/link-modal';
import { fetchWithPagination } from '../../lib/pagination-utils';
import { SortOrder } from '../../components/dashboard/table/table-server-pagination';
import { FilterInput } from '../../components/dashboard/table/default-filter';
import { useToaster } from '../../components/toaster/toaster';
import { NoData } from '../../components/dashboard/empty-data/no-data';

export default component$(() => {
  const toaster = useToaster();

  // Pagination params
  const sort = useSignal<Record<string, SortOrder>>({});
  const page = useSignal(1);
  const limit = useSignal(10);
  const total = useSignal(0);
  const filter = useSignal('');
  const refetch = useSignal(0);

  const isLoadingData = useSignal(true);

  const linksContainerRef = useSignal<HTMLElement>();
  const links = useSignal<{ id: string; key: string; url: string; createdAt: string }[]>([]);

  useVisibleTask$(async ({ track }) => {
    track(() => filter.value);
    track(() => refetch.value);
    track(() => page.value);

    // Default sort order
    sort.value = {
      createdAt: SortOrder.DESC,
    };

    isLoadingData.value = true;

    try {
      const data = await fetchWithPagination({
        url: `${process.env.CLIENTSIDE_API_DOMAIN}/api/v1/links`,
        page: page.value,
        limit: limit.value,
        sort: sort.value,
        filter: filter.value,
      });

      isLoadingData.value = false;

      links.value = filter.value ? data.data : [...links.value, ...data.data];
      total.value = data.total;
    } catch (err) {
      toaster.add({
        title: 'Oops! Something went wrong',
        description: 'We could not load your links. Please try again later.',
        type: 'error',
      });
      isLoadingData.value = false;
    }
  });

  // Watch for scroll events and load more items if necessary
  useVisibleTask$(
    () => {
      const linksContainer = linksContainerRef.value;
      if (linksContainer) {
        const checkScroll = () => {
          const maxPages = Math.ceil(total.value / limit.value);
          if (!maxPages || page.value > maxPages - 1) {
            return;
          }

          if (linksContainer.scrollTop + linksContainer.clientHeight < linksContainer.scrollHeight - 120) {
            return;
          }

          page.value++;
        };

        const debouncedCheckScroll = debounce(checkScroll, 50); // 200ms debounce time
        linksContainer.addEventListener('scroll', debouncedCheckScroll);
      }
    },
    {
      strategy: 'document-ready',
    }
  );

  const onModalSubmit = $(() => {
    refetch.value++;
    filter.value = '';

    toaster.add({
      title: 'Link created',
      description: 'Link created successfully and ready to use!',
      type: 'info',
    });
  });

  return (
    <>
      <LinkModal onSubmitHandler={onModalSubmit} />
      <div class="flex">
        <FilterInput
          filter={filter}
          onInput={$((ev: InputEvent) => {
            filter.value = (ev.target as HTMLInputElement).value;
            page.value = 1; // Reset page number when filter changes
          })}
        />
        <div class="ml-auto pl-4">
          <button class="btn btn-primary" onClick$={() => (document.getElementById(LINK_MODAL_ID) as any).showModal()}>
            Create
          </button>
        </div>
      </div>
      <div ref={linksContainerRef} class="links overflow-y-auto" style={{ maxHeight: 'calc(100vh - 150px)' }}>
        {!links.value.length && isLoadingData.value ? ( // Only if it's the first load (links are empty)
          <div class="flex items-center justify-center h-40">
            <span class="loading loading-spinner loading-lg"></span>
          </div>
        ) : links.value.length ? (
          <>
            {links.value.map((link) => {
              return <LinkBlock key={link.key} urlKey={link.key} url={link.url} createdAt={link.createdAt} />;
            })}
            {isLoadingData.value && (
              <div class="flex items-center justify-center h-40">
                <span class="loading loading-spinner loading-md"></span>
              </div>
            )}
          </>
        ) : (
          <div class="text-center pt-10">
            <NoData
              title={'Oops! No links found'}
              description={`${filter.value ? 'Try to change your filter or ' : 'Try to '} create a new link`}
            ></NoData>
          </div>
        )}
      </div>
    </>
  );
});

function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...funcArgs: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return function (...args: Parameters<T>) {
    const later = () => {
      timeoutId = null;
      func(...args);
    };

    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(later, wait);
  };
}

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
