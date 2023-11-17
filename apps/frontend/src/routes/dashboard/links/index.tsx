import { component$ } from '@builder.io/qwik';
import { DocumentHead } from '@builder.io/qwik-city';
import { LINK_MODAL_ID, LinkModal } from '../../../components/dashboard/links/link-modal/link-modal';
import { LinksWrapper } from '../../../components/dashboard/links/links-wrapper';
import { QrCodeDialog } from '../../../components/temporary-links/qr-code-dialog/qr-code-dialog';

export default component$(() => {
  return (
    <>
      <LinkModal />
      <h1 class="text-2xl">Links</h1>
      <button class="btn btn-primary" onClick$={() => (document.getElementById(LINK_MODAL_ID) as any).showModal()}>
        Create a link
      </button>

      <LinksWrapper />
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
