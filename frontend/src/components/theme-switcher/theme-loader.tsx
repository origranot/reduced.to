import { component$, useContext, useVisibleTask$ } from '@builder.io/qwik';
import { GlobalStore } from '../../context';
import {
  colorSchemeChangeListener,
  DARK_THEME,
  getColorPreference,
  LIGHT_THEME,
  setPreference,
} from '../theme-switcher/theme-switcher';

export const ThemeLoader = component$(() => {
  const globalStore = useContext(GlobalStore);

  useVisibleTask$(() => {
    globalStore.theme = getColorPreference();
    return colorSchemeChangeListener((isDark) => {
      globalStore.theme = isDark ? DARK_THEME : LIGHT_THEME;
      setPreference(globalStore.theme);
    });
  });

  return <div data-theme-loader></div>;
});
