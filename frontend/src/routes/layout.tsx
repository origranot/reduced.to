import { component$, Slot } from '@builder.io/qwik';
import { ThemeLoader } from '~/components/theme-switcher/theme-loader';

// export interface ThemeStore {
//   darkMode: boolean;
// }

// export const ThemeContext = createContext('theme');

export default component$(() => {
  // const state = useStore<ThemeStore>({
  //   darkMode: true,
  // });

  // useContextProvider(ThemeContext, state);

  // useClientEffect$(() => {
  //   state.darkMode = localStorage.getItem(LOCAL_STORAGE_THEME_KEY) === 'true';
  // });

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
