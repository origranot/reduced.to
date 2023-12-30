import { component$ } from '@builder.io/qwik';
import { DocumentHead, routeLoader$ } from '@builder.io/qwik-city';
import { ACCESS_COOKIE_NAME } from '../../shared/auth.service';
import { LinkBlock } from '../../components/dashboard/links/link';

export const useLinks = routeLoader$(async ({ cookie }) => {
  const res = await fetch(`${process.env.CLIENTSIDE_API_DOMAIN}/api/v1/links?limit=10`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${cookie.get(ACCESS_COOKIE_NAME)?.value}`,
    },
  });
  const links = await res.json();
  return links.data as [{ url: string; key: string; message?: string[]; statusCode?: number }];
});

export default component$(() => {
  const signal = useLinks();

  return (
    <>
      <div class="shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-xl w-full p-5">
        {signal.value.length ? (
          signal.value.map((link) => {
            return <LinkBlock urlKey={link.key} url={link.url} />;
          })
        ) : (
          <div class="text-center">You don't have any links yet.</div>
        )}
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
