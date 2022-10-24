import { component$, useClientEffect$, useServerMount$, useStore } from '@builder.io/qwik';
import { useLocation } from '@builder.io/qwik-city';

export default component$(() => {
  const store = useStore({
    urlRedirect: '',
  });

  const location = useLocation();

  useServerMount$(async () => {
    const urlId = location.params.urlId.replace(/\//g, '');

    try {
      const res = await fetch(`${process.env.API_DOMAIN}/api/v1/shortener/${urlId}`);
      store.urlRedirect = await res.text();
    } catch (err) {
      store.urlRedirect = 'unknown';
    }
  });

  useClientEffect$(async () => {
    window.location.replace(store.urlRedirect);
  });

  return <div />;
});
