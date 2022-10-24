import { component$, useClientEffect$ } from '@builder.io/qwik';
import { useLocation } from '@builder.io/qwik-city';

export default component$(() => {
  const location = useLocation();

  useClientEffect$(async () => {
    console.log(process.env.API_DOMAIN);

    const urlId = location.params.urlId.replace(/\//g, '');
    const res = await fetch(`${process.env.API_DOMAIN}/api/v1/shortener/${urlId}`);
    const url = await res.text();

    window.location.replace(url || '/unknown');
  });

  return <div />;
});
