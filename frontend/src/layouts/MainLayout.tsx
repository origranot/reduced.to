import { component$, Slot } from '@builder.io/qwik';

export default component$(() => {
  return (
    // Navbar will go here
    <main>
      <section>
        <Slot />
      </section>
    </main>
    // Footer will go here
  );
});
