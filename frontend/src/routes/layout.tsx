import {
  component$,
  createContext,
  Slot,
  useContextProvider,
  useStore,
} from '@builder.io/qwik';

export interface ThemeStore {
  darkMode: boolean;
}
export const ThemeContext = createContext('theme');

export default component$(() => {
  const state = useStore<ThemeStore>({
    darkMode: true,
  });

  useContextProvider(ThemeContext, state);

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
