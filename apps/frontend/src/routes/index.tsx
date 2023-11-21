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
  title: 'The FREE Open-Source URL Shortener | Reduced.to',
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
