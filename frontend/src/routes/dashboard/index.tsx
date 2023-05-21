import { component$ } from '@builder.io/qwik';
import { DocumentHead } from '@builder.io/qwik-city';

export default component$(() => {
  return (
    <>
      <h1>Dashboard</h1>
      <p class="text-red-700">//TODO: Implement some components</p>
    </>
  );
});

export const head: DocumentHead = {
  title: 'Reduced.to | Dashboard',
  meta: [
    {
      name: 'title',
      content: 'Reduced.to | Dashboard',
    },
    {
      name: 'description',
      content: 'Reduced.to | Your dashboard page. See your stats, shorten links, and more!',
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
      content: 'Reduced.to | Dashboard',
    },
    {
      property: 'og:description',
      content: 'Reduced.to | Your dashboard page. See your stats, shorten links, and more!',
    },
    {
      property: 'twitter:card',
      content: 'summary',
    },
    {
      property: 'twitter:title',
      content: 'Reduced.to | Dashboard',
    },
    {
      property: 'twitter:description',
      content: 'Reduced.to | Your dashboard page. See your stats, shorten links, and more!',
    },
  ],
};
