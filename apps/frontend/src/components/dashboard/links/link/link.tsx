import { component$, $ } from '@builder.io/qwik';
import { getLinkFromKey } from '../../../temporary-links/utils';
import LinkActionsDropdown from './link-actions-dropdown';
import { HiArrowTopRightOnSquareOutline, HiTrashOutline } from '@qwikest/icons/heroicons';
import { formatDate } from '../../../../lib/date-utils';

export interface LinkBlockProps {
  id: string;
  urlKey: string;
  url: string;
  favicon?: string;
  createdAt: string;
  onDelete: (id: string) => void;
}

export const LinkBlock = component$(({ id, urlKey, url, favicon, createdAt, onDelete }: LinkBlockProps) => {
  const link = getLinkFromKey(urlKey);

  return (
    <>
      <div class="shadow-lg rounded-xl p-3 mb-3 bg-white dark:bg-dark-modal">
        <div class="grid grid-cols-12 gap-4">
          {/* First column with the link and favicon */}
          <div class="flex items-center space-x-3 col-span-6">
            <div class="hidden sm:block">
              <img src={favicon || `https://www.google.com/s2/favicons?sz=64&domain_url=${url}`} class="w-8 h-8 rounded-full" />
            </div>
            <div class="flex flex-col text-left">
              <div class="text-sm font-medium truncate">{link}</div>
              <div class="text-xs font-medium text-gray-500 truncate">{url}</div>
            </div>
          </div>

          {/* Second column with the created date */}
          <div class="items-center justify-end hidden sm:flex col-span-5 sm:mr-2">
            <span class="text-xs font-medium text-gray-500">{formatDate(new Date(createdAt))}</span>
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
