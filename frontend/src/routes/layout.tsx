import { component$, Slot } from '@builder.io/qwik';
import { ThemeLoader } from '~/components/theme-switcher/theme-loader';

export default component$(() => {
  return (
    <>
      <ThemeLoader />
      <main class="h-screen">
        <section>
          <Slot />
        </section>
      </main>
    </>
  );
});
