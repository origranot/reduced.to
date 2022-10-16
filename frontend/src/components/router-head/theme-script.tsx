import { DARK_THEME, LIGHT_THEME } from '../theme-switcher/theme-switcher';

export const themeStorageKey = 'theme-preference';

export const ThemeScript = () => {
  const themeScript = `
        document.firstElementChild
            .setAttribute('data-theme',
                localStorage.getItem('${themeStorageKey}') ??
                (window.matchMedia('(prefers-color-scheme: dark)').matches ? '${DARK_THEME}' : '${LIGHT_THEME}')
            )`;
  return <script dangerouslySetInnerHTML={themeScript} />;
};
