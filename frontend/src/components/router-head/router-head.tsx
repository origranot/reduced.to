import { component$ } from '@builder.io/qwik';
import { useDocumentHead, useLocation } from '@builder.io/qwik-city';

/**
 * The RouterHead component is placed inside of the document `<head>` element.
 */
export const RouterHead = component$(() => {
  const head = useDocumentHead();
  const loc = useLocation();

  return (
    <>
      <title>{head.title}</title>

      <link rel="canonical" href={loc.href} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="icon" type="image/png" href="/favicon.png" />

      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link
        href="https://fonts.googleapis.com/css2?family=Poppins&amp;display=swap"
        rel="stylesheet"
      />
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css"
        integrity="sha512-c42qTSw/wPZ3/5LBzD+Bw5f7bSF2oxou6wEb+I/lqeaKV5FDIfMvvRp772y4jcJLKuGUOpbJMdg/BTl50fJYAw=="
        crossOrigin="anonymous"
        referrerPolicy="no-referrer"
      />
      <script async defer src="https://buttons.github.io/buttons.js"></script>
      <meta property="og:site_name" content="Qwik" />

      <meta name="description" content="Reduced.to is a Free Modern URL Reducer" />
      <meta name="robots" content="index, follow">
      <meta property="og:locale" content="en_US" />
      <meta property="og:type" content="website" />
      <meta property="og:title" content="Reduced.to | URL Shortener" />
      <meta property="og:description" content="Reduced.to is a Free Modern URL Reducer" />
      <meta property="og:url" content="https://reduced.to/" />
      <meta property="og:site_name" content="Reduced.to" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Reduced.to | URL Shortener" />
      <meta name="twitter:description" content="Reduced.to is a Free Modern URL Reducer" />

      {head.meta.map((m) => (
        <meta {...m} />
      ))}

      {head.links.map((l) => (
        <link {...l} />
      ))}

      {head.styles.map((s) => (
        <style {...s.props} dangerouslySetInnerHTML={s.style} />
      ))}
    </>
  );
});
