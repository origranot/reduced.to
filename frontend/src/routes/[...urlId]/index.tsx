import { component$, useClientEffect$, useLexicalScope } from '@builder.io/qwik';
import { useLocation } from '@builder.io/qwik-city';

export default component$(() => {
  const location = useLocation();

  useClientEffect$(async () => {
    const urlId = location.params.urlId.replace(/\//g, '');

    const [store] = useLexicalScope();
    store.url = '/unknown';
    try {
      const res = await fetch(`${process.env.API_DOMAIN}/api/v1/shortener/${urlId}`);

      if (res.status !== 200) {
        throw new Error('failed to fetch original url...');
      }
      store.url = await res.text();
    } catch (err) {
      console.error(err);
    }

    window.location.replace(store.url);
  });

  return <div />;
});
