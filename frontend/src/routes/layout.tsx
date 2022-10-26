import { component$, Slot } from '@builder.io/qwik';
import { ThemeLoader } from '~/components/theme-switcher/theme-loader';

export default component$(() => {
  return (
    <>
      <ThemeLoader />
      <main class="h-screen overflow-x-hidden overflow-y-auto md:overflow-hidden ">
        <section>
          <Slot />
        </section>
      </main>
    </>
  );
});
