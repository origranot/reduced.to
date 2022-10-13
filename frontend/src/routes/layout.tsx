import { component$, Slot } from '@builder.io/qwik';
import { Waves } from '~/components/waves/waves';

export default component$(() => {
  return (
    <>
      <main data-theme="dracula" class="h-screen">
        <section class="min-h-screen flex flex-col">
          <Slot />
          <Waves />
        </section>
      </main>
    </>
  );
});
