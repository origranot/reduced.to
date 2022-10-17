import { component$, useContextProvider, useStore } from '@builder.io/qwik';
import {
  QwikCity,
  RouterOutlet,
  ServiceWorkerRegister,
} from '@builder.io/qwik-city';
import { RouterHead } from './components/router-head/router-head';
import { GlobalStore, SiteStore } from './context';

import './global.css';

export default component$(() => {
  /**
   * The root of a QwikCity site always start with the <QwikCity> component,
   * immediately followed by the document's <head> and <body>.
   *
   * Dont remove the `<head>` and `<body>` elements.
   */

  const store = useStore<SiteStore>({
    theme: 'auto',
  });
  useContextProvider(GlobalStore, store);

  return (
    <QwikCity>
      <head>
        <meta
          name="google-site-verification"
          content="Q9tCAwIfwf_wfLdpL1WEhDeJy1WHUc65JM2MMjsCOCg"
        />
        <meta charSet="utf-8" />
        <RouterHead />
      </head>
      <body>
        <RouterOutlet />
        <ServiceWorkerRegister />
      </body>
    </QwikCity>
  );
});
