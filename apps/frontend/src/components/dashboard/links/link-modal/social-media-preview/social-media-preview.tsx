import { Signal, component$, useSignal, useVisibleTask$ } from '@builder.io/qwik';
import { socialMediaPlatforms } from './social-media-data';
import { SocialMediaLayout } from './social-media-layout';
import { authorizedFetch } from '../../../../../shared/auth.service';
import { normalizeUrl } from '../../../../../utils';

export interface Metadata {
  title: string | null;
  description: string | null;
  image: string | null;
  url: string | null;
  hostname: string | null;
}

export interface SocialMediaPreviewProps {
  url: Signal<string | null>;
}

export const SocialMediaPreview = component$(({ url }: SocialMediaPreviewProps) => {
  const state = useSignal<Metadata>({
    title: null,
    description: null,
    image: null,
    url: null,
    hostname: null,
  });

  const loading = useSignal<boolean>(false);
  const prevUrl = useSignal<string | null>(null);

  useVisibleTask$(({ track }) => {
    const currentUrl = track(() => url.value);
    if (prevUrl === null || currentUrl !== prevUrl.value) {
      const debounceTimeout = setTimeout(async () => {
        try {
          prevUrl.value = currentUrl || '';
          loading.value = true;
          const normalizedUrl = normalizeUrl(currentUrl || '');
          const data = await authorizedFetch(`${process.env.CLIENTSIDE_API_DOMAIN}/api/v1/metadata?url=${normalizedUrl}`);
          const metadata = await data.json();
          state.value = metadata;
        } catch (error) {
          console.error('Could not fetch metadata', error);
        } finally {
          loading.value = false;
        }
      }, 500); // 500ms debounce time

      return () => {
        clearTimeout(debounceTimeout);
      };
    }
  });

  return (
    <>
      <div class="grid gap-5 p-5">
        {socialMediaPlatforms.map(({ name, logo }) => (
          <div key={name}>
            <div class="divider pb-2">
              <span>{logo}</span>
              {name}
            </div>
            <SocialMediaLayout platformName={name} metadata={state.value} loading={loading.value} />
          </div>
        ))}
      </div>
    </>
  );
});
