import { component$, useContext, useStylesScoped$ } from '@builder.io/qwik';
import { ThemeContext, ThemeStore } from '~/routes/layout';
import styles from './theme-switcher.css?inline';

export const LOCAL_STORAGE_THEME_KEY = 'isDarkMode';
export const ThemeSwitcher = component$(() => {
  useStylesScoped$(styles);
  const state: ThemeStore = useContext(ThemeContext) as ThemeStore;

  return (
    <div class="inline-grid grid-cols-2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-4 w-4 m-1 col-start-1 row-start-1"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
        />
      </svg>

      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-4 w-4 m-1 col-start-2 row-start-1"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
        />
      </svg>

      <input
        type="checkbox"
        checked={state.darkMode}
        class="toggle bg-transparent col-start-1 row-start-1 col-span-2 "
        onClick$={() => {
          state.darkMode = !state.darkMode;
          localStorage.setItem(LOCAL_STORAGE_THEME_KEY, `${state.darkMode}`);
        }}
      />
    </div>
  );
});
