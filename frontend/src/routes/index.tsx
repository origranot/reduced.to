import {
  component$,
  createContext,
  useContextProvider,
  useSignal,
  useStore,
  useStylesScoped$,
} from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';
import { GithubButton } from '~/components/github-button/github-button';
import { Loader } from '~/components/loader/loader';
import { generateQRCode } from '~/components/qr-code/handleQRCode';
import { QRCode } from '~/components/qr-code/qr-code';
import { copyUrl, handleShortener, openLink } from '~/components/shortener-input/handleShortener';
import { ShortenerInput } from '~/components/shortener-input/shortener-input';
import { ThemeSwitcher } from '~/components/theme-switcher/theme-switcher';
import { Tooltip } from '~/components/tooltip/tooltip';
import { Waves } from '~/components/waves/waves';
import animations from '../assets/css/animations.css?inline';
import styles from './index.css?inline';

export const InputContext = createContext('input');

export interface Store {
  inputValue: string;
}

export default component$(() => {
  useStylesScoped$(animations);
  useStylesScoped$(styles);

  const tooltipCopyRef = useSignal(false);

  const state = useStore<Store>({
    inputValue: '',
  });

  useContextProvider(InputContext, state);

  return (
    <div class="min-h-screen flex flex-col">
      <div class="mx-auto container grid grid-cols-12 flex-1">
        <div class="col-start-2 col-end-12 md:col-start-3 md:col-end-11">
          <div className="flex flex-col">
            <div className="flex justify-end my-5">
              <div className="flex">
                <div className="grid  flex-grow place-items-center">
                  <span className="h-5">
                    <GithubButton
                      type="Star"
                      user="origranot"
                      repo="reduced.to"
                      showCount
                      label="Star"
                    ></GithubButton>
                  </span>
                </div>
                <div className="divider divider-horizontal"></div>
                <div className="grid  flex-grow place-items-center">
                  <ThemeSwitcher></ThemeSwitcher>
                </div>
              </div>
            </div>
            <article class="prose mx-auto max-w-4xl pb-16">
              <div class="mx-auto">
                <img class="mx-auto" src="logo.png" width="410" height="73" alt="Logo" />
              </div>
              <p>
                Add your very long <b>URL</b> in the input below and click on the button to make it
                shorter
              </p>
            </article>
            <ShortenerInput
              onKeyUp$={(event) => {
                if (event.key.toLowerCase() === 'enter' && state.inputValue.length > 0) {
                  handleShortener({ state });
                }
              }}
              onInput$={(event) => (state.inputValue = (event.target as HTMLInputElement).value)}
              onSubmit$={() => handleShortener({ state })}
            />
            <Loader />
            <div id="result" class="hidden">
              <p id="error" className="fade-in"></p>
              <span id="text" className="fade-in cursor-pointer" onClick$={() => copyUrl()}></span>
              <div
                id="action"
                className="hidden btn-group p-4 relative [&>:first-child>.btn]:rounded-l-lg [&>:last-child>.btn]:rounded-r-lg [&>*>.btn]:rounded-none"
              >
                <button
                  type="button"
                  title="Copy"
                  className="btn relative"
                  onClick$={() => {
                    copyUrl();
                    tooltipCopyRef.value = true;
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75"
                    />
                  </svg>
                  <Tooltip label="Copied!" position="bottom" open={tooltipCopyRef}></Tooltip>
                </button>
                <button
                  type="button"
                  title="Open in new tab"
                  className="btn"
                  onClick$={() => openLink()}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                    />
                  </svg>
                </button>
                <button
                  type="button"
                  title="QR Code"
                  className="btn"
                  onClick$={() => generateQRCode(150)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z"
                    />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M6.75 6.75h.75v.75h-.75v-.75zM6.75 16.5h.75v.75h-.75v-.75zM16.5 6.75h.75v.75h-.75v-.75zM13.5 13.5h.75v.75h-.75v-.75zM13.5 19.5h.75v.75h-.75v-.75zM19.5 13.5h.75v.75h-.75v-.75zM19.5 19.5h.75v.75h-.75v-.75zM16.5 16.5h.75v.75h-.75v-.75z"
                    />
                  </svg>
                </button>
              </div>
            </div>
            <div id="qrcode" className="hidden mx-auto">
              <QRCode showDownload />
            </div>
          </div>
        </div>
      </div>
      <Waves />
    </div>
  );
});

export const head: DocumentHead = {
  title: 'The FREE Open-Source URL Shortener | Reduced.to',
  meta: [
    {
      name: 'title',
      content: 'Reduced.to | The FREE Open-Source URL Shortener',
    },
    {
      name: 'description',
      content:
        'Reduced.to is the FREE, Modern, and Open-Source URL Shortener. Convert those ugly and long URLs into short, easy to manage links and QR-Codes.',
    },
    {
      property: 'og:type',
      content: 'website',
    },
    {
      property: 'og:url',
      content: 'https://reduced.to',
    },
    {
      property: 'og:title',
      content: 'Reduced.to | The FREE Open-Source URL Shortener',
    },
    {
      property: 'og:description',
      content:
        'Reduced.to is the FREE, Modern, and Open-Source URL Shortener. Convert those ugly and long URLs into short, easy to manage links and QR-Codes.',
    },
    {
      property: 'twitter:card',
      content: 'summary',
    },
    {
      property: 'twitter:title',
      content: 'Reduced.to | The FREE Open-Source URL Shortener',
    },
    {
      property: 'twitter:description',
      content:
        'Reduced.to is the FREE, Modern, and Open-Source URL Shortener. Convert those ugly and long URLs into short, easy to manage links and QR-Codes.',
    },
  ],
};
