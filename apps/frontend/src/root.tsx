import { component$, useContextProvider, useStore } from '@builder.io/qwik';
import { QwikCityProvider, RouterOutlet, ServiceWorkerRegister } from '@builder.io/qwik-city';
import { RouterHead } from './components/router-head/router-head';
import { ThemeLoader } from './components/theme-switcher/theme-loader';
import { GlobalStore, SiteStore } from './context';

import './global.css';

export default component$(() => {
  const store = useStore<SiteStore>({
    theme: 'auto',
  });

  useContextProvider(GlobalStore, store);

  return (
    <QwikCityProvider>
      <head>
        <meta charSet="utf-8" />
        {/** Workaround to handle insecure communication between pods while serve on https */}
        <meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests" />
        <RouterHead />
      </head>
      <body>
        <ThemeLoader />
        <RouterOutlet />
        <ServiceWorkerRegister />
      </body>
    </QwikCityProvider>
  );
});
