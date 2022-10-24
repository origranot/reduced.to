import { component$, useClientEffect$ } from '@builder.io/qwik';
import { useLocation } from '@builder.io/qwik-city';

export default component$(() => {
  const location = useLocation();
  useClientEffect$(async () => {
    const urlId = location.params.urlId.replace(/\//g, '');
    const res = await fetch(`${import.meta.env.VITE_API_DOMAIN}/api/v1/shortener/${urlId}`);
    const url = await res.text();

    window.location.replace(url.length ? url : '/unknown');
  });

  return <div />;
});
