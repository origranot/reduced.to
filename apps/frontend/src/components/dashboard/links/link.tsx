import { Signal, component$, useSignal } from '@builder.io/qwik';
import { copyToClipboard, normalizeUrl } from '../../../utils';
import { HiCheckOutline, HiClipboardDocumentOutline, HiQrCodeOutline } from '@qwikest/icons/heroicons';
import { QR_CODE_DIALOG_ID } from '../../temporary-links/qr-code-dialog/qr-code-dialog';

export interface ILink {
  urlKey: string;
  url: string;
  favicon?: string;
}

export interface LinkProps extends ILink {
  interactedLink: Signal<ILink | null>;
}

export const LinkBlock = component$((props: LinkProps) => {
  const { urlKey, url, favicon, interactedLink } = props;

  const customUrl = `${process.env.DOMAIN}/${urlKey}`;

  const copiedLinkKey = useSignal('');

  return (
    <li
      class="flex max-w-md items-center justify-between rounded-md bg-base-100 dark:bg-slate-800 p-3 shadow-lg border border-base-200"
      key={urlKey}
    >
      <div class="flex items-center space-x-3">
        <img
          alt={url}
          loading="lazy"
          width="20"
          height="20"
          decoding="async"
          data-nimg="1"
          class="pointer-events-none h-10 w-10 rounded-full blur-0"
          src={favicon}
        />
        <div>
          <a class="font-semibold" href={customUrl} target="_blank" rel="noreferrer">
            {customUrl}
          </a>
          <p class="text-sm text-gray-400 line-clamp-1 text-left">{url.length > 30 ? `${url.substring(0, 30)}...` : url}</p>
        </div>
      </div>
      <div class="flex items-center">
        <button
          class="rounded-full p-1.5 text-gray-500 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-slate-700 focus:outline-none focus:ring focus:border-blue-300 bg-gray-200 dark:bg-gray-600 mr-2 pb-0"
          onClick$={async () => {
            copyToClipboard(normalizeUrl(customUrl));
            copiedLinkKey.value = urlKey;
            setTimeout(() => (copiedLinkKey.value = ''), 2000); // Reset icon after 2 seconds (adjust timing as needed)
          }}
        >
          <span class="sr-only">Copy</span>
          <label class="swap swap-rotate">
            <HiClipboardDocumentOutline class={`${copiedLinkKey.value === urlKey ? 'swap-on' : 'swap-off'} h-5 w-5`} />
            <HiCheckOutline class={`${copiedLinkKey.value === urlKey ? 'swap-off' : 'swap-on'} h-5 w-5`} />
          </label>
        </button>
        <button
          class="rounded-full p-1.5 text-gray-500 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-slate-700 focus:outline-none focus:ring focus:border-blue-300 bg-gray-200 dark:bg-gray-600 mr-2"
          onClick$={() => {
            interactedLink.value = props;
            (document.getElementById(QR_CODE_DIALOG_ID) as any).showModal();
          }}
        >
          <HiQrCodeOutline class="h-5 w-5" />
        </button>
      </div>
    </li>
  );
});
