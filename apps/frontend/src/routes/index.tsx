import { component$, useStylesScoped$ } from '@builder.io/qwik';
import { DocumentHead } from '@builder.io/qwik-city';
import animations from '../assets/css/animations.css?inline';
import styles from './index.css?inline';
import { Hero } from '../components/hero/hero';
import { Footer } from '../components/footer/footer';
import { TemporaryLinks } from '../components/temporary-links/temporary-links';

export default component$(() => {
  useStylesScoped$(animations);
  useStylesScoped$(styles);

  return (
    <>
      <Hero />
      <TemporaryLinks />
      <Footer />
    </>
  );
});
export const head: DocumentHead = {
  title: 'Reduced.to - Free & Open-Source URL Shortener',
  meta: [
    {
      name: 'title',
      content: 'Simplify Your Links with Reduced.to | Free & Open-Source URL Shortener',
    },
    {
      name: 'description',
      content:
        'Transform cumbersome URLs into neat, manageable links with Reduced.to, the free and open-source URL shortener. Perfect for enhancing link sharing and tracking!',
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
      content: 'Simplify Your Links | Reduced.to - Free Open-Source URL Shortener',
    },
    {
      property: 'og:description',
      content:
        'Discover the ease of managing and tracking your links with Reduced.to, the ultimate free and open-source URL shortener. Start creating clean, concise URLs today!',
    },
    {
      property: 'og:image',
      content: 'https://reduced.to/images/thumbnail.png',
    },
    {
      property: 'twitter:card',
      content: 'summary_large_image',
    },
    {
      property: 'twitter:url',
      content: 'https://reduced.to',
    },
    {
      property: 'twitter:title',
      content: 'Simplify Your Links with Reduced.to | Free & Open-Source',
    },
    {
      property: 'twitter:description',
      content:
        'Transform cumbersome URLs into neat, manageable links with Reduced.to, the free and open-source URL shortener. Perfect for enhancing link sharing and tracking!',
    },
    {
      property: 'twitter:image',
      content: 'https://reduced.to/images/thumbnail.png',
    },
  ],
};
