import { component$, $ } from '@builder.io/qwik';
import { getLinkFromKey } from '../../../temporary-links/utils';
import LinkActionsDropdown from './link-actions-dropdown';
import { HiArrowTopRightOnSquareOutline, HiClipboardDocumentOutline, HiQrCodeOutline, HiTrashOutline } from '@qwikest/icons/heroicons';
import { formatDateDay } from '../../../../lib/date-utils';
import { useToaster } from '../../../toaster/toaster';
import { copyToClipboard, normalizeUrl } from '../../../../utils';

export interface LinkBlockProps {
  id: string;
  urlKey: string;
  url: string;
  favicon?: string;
  createdAt: string;
  expirationTime?: string;
  onShowQR: () => void;
  onDelete: (id: string) => void;
}

export const LinkBlock = component$(({ id, urlKey, url, favicon, createdAt, expirationTime, onShowQR, onDelete }: LinkBlockProps) => {
  const link = getLinkFromKey(urlKey);
  const toaster = useToaster();

  return (
    <>
      <div class="shadow-lg rounded-xl p-3 mb-3 bg-white dark:bg-dark-modal">
        <div class="grid grid-cols-12 gap-4">
          {/* First column with the link and favicon */}
          <div class="flex items-center space-x-3 col-span-6">
            <div class="hidden sm:block flex-shrink-0">
              <img
                alt={new URL(url).hostname}
                src={favicon || `https://www.google.com/s2/favicons?sz=64&domain_url=${url}`}
                class="w-8 h-8 rounded-full"
              />
            </div>
            <div class="flex flex-col text-left w-full">
              <a href={link} target="_blank" rel="noopener noreferrer" class="text-sm font-medium truncate">
                {link}
              </a>
              <a href={url} target="_blank" rel="noopener noreferrer" class="text-xs mt-1 font-medium text-gray-500 truncate">
                {url}
              </a>
            </div>
          </div>

          {/* Second column with the created date */}
          <div class="gap-4 mt-2 items-center justify-end hidden sm:flex col-span-5 sm:mr-2">
            {expirationTime && (
              <div class="flex flex-col justify-start mr-3">
                <span class="text-xs font-medium  ">{formatDateDay(new Date(expirationTime))}</span>
                <span class="text-xs font-medium text-gray-500 mb-1 mt-1">Expire At</span>
              </div>
            )}
            <div class="flex flex-col justify-start mr-3">
              <span class="text-xs font-medium  ">{formatDateDay(new Date(createdAt))}</span>
              <span class="text-xs font-medium text-gray-500 mb-1 mt-1">Created At</span>
            </div>
          </div>
          {/* Third column with the actions dropdown */}
          <div class="flex items-center justify-end col-span-6 sm:col-span-1">
            <LinkActionsDropdown
              url={url}
              actions={[
                {
                  name: 'Open',
                  icon: <HiArrowTopRightOnSquareOutline />,
                  href: url,
                  target: '_blank',
                },
                {
                  name: 'Copy',
                  icon: <HiClipboardDocumentOutline />,
                  action: $(() => {
                    copyToClipboard(normalizeUrl(url));
                    toaster.add({ title: 'Success', description: 'The url has been copied to the clipboard!' });
                  }),
                },
                {
                  name: 'QR',
                  icon: <HiQrCodeOutline />,
                  action: $(() => {
                    onShowQR();
                  }),
                },
                {
                  name: 'Delete',
                  class: 'text-red-500',
                  action: $(() => {
                    onDelete(id);
                  }),
                  icon: <HiTrashOutline />,
                },
              ]}
            />
          </div>
        </div>
      </div>
    </>
  );
});
