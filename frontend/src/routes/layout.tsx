import {
  component$,
  createContext,
  Slot,
  useClientEffect$,
  useContextProvider,
  useStore,
} from '@builder.io/qwik';
import { LOCAL_STORAGE_THEME_KEY } from '../components/theme-switcher/theme-switcher';

export interface ThemeStore {
  darkMode: boolean;
}

export const ThemeContext = createContext('theme');

export default component$(() => {
  const state = useStore<ThemeStore>({
    darkMode: true,
  });

  useContextProvider(ThemeContext, state);

  useClientEffect$(() => {
    state.darkMode = localStorage.getItem(LOCAL_STORAGE_THEME_KEY) === 'true';
  });

  return (
    <>
      <main data-theme={state.darkMode ? 'dracula' : 'winter'} class="h-screen">
        <section>
          <Slot />
        </section>
      </main>
    </>
  );
});
