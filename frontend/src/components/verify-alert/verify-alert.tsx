import { component$, useSignal } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';


export const VerifyAlert = component$(() => {
  const hide = useSignal<boolean>(false);

  return (
    <div class={`alert alert-warning shadow-lg ${hide.value ? 'hidden' : ''}`}>
      <div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="stroke-current flex-shrink-0 h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <span>
          Your account is not verified, you may not be able to access all features of the app until
          you verify your account.
        </span>
      </div>
      <div class="flex-none">
        <Link href="/register/verify" class="btn btn-sm btn-ghost">
          Click here to Verify
        </Link>
        <button
          class="btn btn-sm btn-ghost text-2xl"
          onClick$={() => {
            hide.value = true;
          }}
        >
          {/* // TODO: Replace with icons from qwikest-icons (wait for issue https://github.com/qwikest/icons/issues/11) */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            class="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </button>
      </div>
    </div>
  );
});
