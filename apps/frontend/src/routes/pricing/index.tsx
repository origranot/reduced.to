import { component$ } from '@builder.io/qwik';
import { Footer } from '../../components/footer/footer';
import { DocumentHead } from '@builder.io/qwik-city';
import { Pricing } from '../../components/pricing/pricing';
import { Background } from '../../components/background/background';
import { Faq } from '../../components/faq/faq';

export default component$(() => {
  return (
    <>
      <Background />
      <Pricing />
      <Faq />
      <Footer />
    </>
  );
});
export const head: DocumentHead = {
  title: 'Pricing & Plans | Reduced.to - Free & Open-Source URL Shortener',
  meta: [
    {
      name: 'title',
      content: 'Pricing & Plans | Reduced.to - Free & Open-Source URL Shortener',
    },
    {
      name: 'description',
      content:
        'Explore the pricing and plans of Reduced.to, the free and open-source URL shortener. Choose the best plan for your needs and start simplifying your links today!',
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
      content: 'Pricing & Plans | Reduced.to - Free & Open-Source URL Shortener',
    },
    {
      property: 'og:description',
      content:
        'Explore the pricing and plans of Reduced.to, the free and open-source URL shortener. Choose the best plan for your needs and start simplifying your links today!',
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
      content: 'Pricing & Plans | Reduced.to - Free & Open-Source URL Shortener',
    },
    {
      property: 'twitter:description',
      content:
        'Explore the pricing and plans of Reduced.to, the free and open-source URL shortener. Choose the best plan for your needs and start simplifying your links today!',
    },
    {
      property: 'twitter:image',
      content: 'https://reduced.to/images/thumbnail.png',
    },
  ],
};
