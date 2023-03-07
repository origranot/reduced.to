import { component$, useStylesScoped$ } from '@builder.io/qwik';
import { DocumentHead } from '@builder.io/qwik-city';
import animations from '../../assets/css/animations.css?inline';
import { Waves } from '../../components/waves/waves';

export default component$(() => {
  useStylesScoped$(animations);

  return (
    <section class="h-screen flex flex-col">
      <div class="grow container flex flex-col items-center justify-center px-5 mx-auto my-8">
        <div class="max-w-md text-center mb-8">
          <h2 class="mb-8 font-extrabold text-9xl text-gray-600 dark:text-gray-300">
            <span class="sr-only">Error</span>404
          </h2>
          <p class="text-2xl font-semibold md:text-3xl">Sorry, we couldn't find this page.</p>
          <p class="mt-4 mb-8 dark:text-gray-400">The link is wrong or expired.</p>
          <a
            rel="noopener noreferrer"
            href="/"
            class="px-8 py-3 font-semibold rounded btn btn-primary"
          >
            Back to homepage
          </a>
        </div>
      </div>
      <Waves />
    </section>
  );
});

export const head: DocumentHead = {
  title: '🤷‍♀️ Page not found | Reduced.to',
  meta: [
    {
      name: 'title',
      content: 'Reduced.to | The FREE Open-Source URL Shortener',
    },
    {
      name: 'description',
      content:
        'Reduced.to is the FREE, Modern, and Open-Source URL Shortener. Convert those ugly and long URLs into short, easy to manage links and QR-Codes.',
    },
    {
      property: 'og:type',
      content: 'website',
    },
    {
      property: 'og:url',
      content: 'https://reduced.to',
    },
    {
      property: 'og:title',
      content: 'Reduced.to | The FREE Open-Source URL Shortener',
    },
    {
      property: 'og:description',
      content:
        'Reduced.to is the FREE, Modern, and Open-Source URL Shortener. Convert those ugly and long URLs into short, easy to manage links and QR-Codes.',
    },
    {
      property: 'twitter:card',
      content: 'summary',
    },
    {
      property: 'twitter:title',
      content: 'Reduced.to | The FREE Open-Source URL Shortener',
    },
    {
      property: 'twitter:description',
      content:
        'Reduced.to is the FREE, Modern, and Open-Source URL Shortener. Convert those ugly and long URLs into short, easy to manage links and QR-Codes.',
    },
  ],
};
