import { component$, useSignal } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';

export const VerifyAlert = component$(() => {
  return (
    <div class="alert alert-warning shadow-lg gap-0.5 sm:gap-4">
      <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
      <div>
        <h3 class="font-bold">Your account is not verified!</h3>
        <div class="text-xs">You may not be able to access all features of the app until you verify your account.</div>
      </div>
      <div>
        <Link href="/register/verify" class="btn btn-sm btn-ghost">
          Verify now
        </Link>
      </div>
    </div>
  );
});
