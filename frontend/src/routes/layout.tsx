import { component$, Slot } from '@builder.io/qwik';

export default component$(() => {
  return (
    <>
      <main data-theme="dracula" class="h-screen">
        <section>
          <Slot />
        </section>
      </main>
    </>
  );
});
