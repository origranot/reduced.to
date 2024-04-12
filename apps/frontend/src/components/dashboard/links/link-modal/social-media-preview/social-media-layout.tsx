import { component$ } from '@builder.io/qwik';
import { PlatformName } from './social-media-data';
import { Metadata } from './social-media-preview';
import { LuImage } from '@qwikest/icons/lucide';

interface SocialMediaLayoutProps {
  platformName: PlatformName;
  metadata: Metadata;
  loading: boolean;
}

export const SocialMediaLayout = component$(({ platformName, metadata, loading }: SocialMediaLayoutProps) => {
  const previewMessage = (
    <div class="flex h-[250px] w-full flex-col items-center justify-center space-y-4 dark:bg-gray-100 bg-white">
      <LuImage class="h-7 w-7 text-gray-400" />
      <p class="text-sm text-gray-400">Enter a link to generate a preview.</p>
    </div>
  );
  const renderLayout = () => {
    switch (platformName) {
      case 'Twitter':
        return (
          <div class="relative overflow-hidden rounded-2xl border border-gray-300 dark:border-gray-600">
            {metadata.image && metadata.image.length > 0 ? (
              <img src={metadata.image} alt="Preview" class="h-[250px] w-full object-cover" />
            ) : (
              previewMessage
            )}
            {metadata.title && (
              <div class="absolute bottom-2 left-2 rounded-md bg-gray-600 px-1.5 py-px">
                <h3 class="max-w-sm truncate text-sm text-white">{metadata.title}</h3>
              </div>
            )}
          </div>
        );
      case 'Facebook':
        return (
          <div class="border border-gray-300 dark:border-gray-600">
            {metadata.image && metadata.image.length > 0 ? (
              <img src={metadata.image} alt="Preview" class="h-[250px] w-full object-cover" />
            ) : (
              previewMessage
            )}
            <div class="text-left grid gap-1 border-t border-gray-300 dark:bg-white bg-white p-3">
              {metadata.hostname ? (
                <p class="text-[0.8rem] uppercase text-[#606770]">{metadata.hostname}</p>
              ) : (
                <div class="mb-1 h-4 w-24 rounded-md bg-gray-200" />
              )}
              {metadata.title ? (
                <h3 class="truncate font-semibold text-black">{metadata.title}</h3>
              ) : (
                <div class="mb-1 h-5 w-full rounded-md bg-gray-200" />
              )}
              {metadata.description !== null ? (
                <p class="line-clamp-2 text-sm text-gray-600">{metadata.description === '' ? 'No Description' : metadata.description}</p>
              ) : (
                <div class="grid gap-2">
                  <div class="h-4 w-full rounded-md bg-gray-200" />
                  <div class="h-4 w-48 rounded-md bg-gray-200" />
                </div>
              )}
            </div>
          </div>
        );
      case 'LinkedIn':
        return (
          <div class="overflow-hidden rounded-[2px] shadow-[0_0_0_1px_rgba(0,0,0,0.15),0_2px_3px_rgba(0,0,0,0.2)]">
            {metadata.image && metadata.image.length > 0 ? (
              <img src={metadata.image} alt="Preview" class="h-[250px] w-full object-cover" />
            ) : (
              previewMessage
            )}
            <div class="text-left grid gap-1 border-t border-gray-300 bg-white p-3">
              {metadata.title ? (
                <h3 class="truncate font-semibold text-black">{metadata.title}</h3>
              ) : (
                <div class="mb-1 h-5 w-full rounded-md bg-gray-200" />
              )}
              {metadata.hostname ? (
                <p class="text-xs text-black">{metadata.hostname}</p>
              ) : (
                <div class="mb-1 h-4 w-24 rounded-md bg-gray-200" />
              )}
            </div>
          </div>
        );
      default:
        return <div>Unknown platform</div>;
    }
  };

  return <div>{renderLayout()}</div>;
});
