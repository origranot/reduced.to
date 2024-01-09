import { component$, useSignal, useVisibleTask$, $ } from '@builder.io/qwik';
import { DocumentHead } from '@builder.io/qwik-city';
import { LinkBlock } from '../../components/dashboard/links/link/link';
import LinksFilter from '../../components/dashboard/links/filter/links-filter';
import { LINK_MODAL_ID, LinkModal } from '../../components/dashboard/links/link-modal/link-modal';
import { fetchWithPagination } from '../../lib/pagination-utils';

export default component$(() => {
  const signal = useSignal<{ key: string; url: string }[]>([]);

  useVisibleTask$(async () => {
    signal.value = await fetchWithPagination({
      url: `${process.env.CLIENTSIDE_API_DOMAIN}/api/v1/links`,
      page: 1,
      limit: 10,
    });
  });

  const onModalSubmit = $(() => {
    console.log('Submitted');
  });

  return (
    <>
      <LinkModal onSubmitHandler={onModalSubmit} />
      <div class="flex">
        <LinksFilter />
        <div class="ml-auto pl-4">
          <button class="btn btn-primary" onClick$={() => (document.getElementById(LINK_MODAL_ID) as any).showModal()}>
            Create
          </button>
        </div>
      </div>
      <div class="links">
        {signal.value.length ? (
          signal.value.map((link) => {
            console.log(link);
            return <LinkBlock urlKey={link.key} url={link.url} createdAt={generateRandomDate(new Date(2023, 0, 1), new Date())} />;
          })
        ) : (
          <div class="text-center pt-10">
            <span>You don't have any links yet.</span>
            <br />
            <span class="text-gray-500">Create one by clicking on the create button above.</span>
          </div>
        )}
      </div>
    </>
  );
});

function generateRandomDate(from: Date, to: Date) {
  return new Date(from.getTime() + Math.random() * (to.getTime() - from.getTime()));
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
