import { component$, $, useSignal } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';

export interface UseCookiesAlertProps {
  visible: boolean;
}

export const ACCEPT_COOKIES_COOKIE_NAME = 'accept-cookies';

export const UseCookiesAlert = component$((props: UseCookiesAlertProps) => {
  const visible = useSignal<boolean>(props.visible);
  const acceptCookies = $(() => {
    document.cookie = `${ACCEPT_COOKIES_COOKIE_NAME}=true; max-age=31536000; path=/`;
    visible.value = false;
  });
  return (
    <>
      {visible.value ? (
        <>
          <div class="fixed flex flex-col bottom-4 right-4 rounded-lg bg-base-100 shadow-md p-6">
            <span class="text-md mb-3 max-w-[17rem]">We use cookies to automatically save and load your preferences.</span>
            <div class="flex items-center gap-2">
              <Link href="/privacy-policy" class="btn btn-ghost flex-1 text-xs whitespace-nowrap mr-5">
                Privacy Policy
              </Link>
              <button
                onClick$={acceptCookies}
                class="btn btn-primary relative flex items-center gap-3 transition ease-in-out border px-4 py-2 rounded-md"
              >
                Accept
              </button>
            </div>
          </div>
        </>
      ) : (
        ''
      )}
    </>
  );
});
