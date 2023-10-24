import { component$, useStore, useVisibleTask$ } from '@builder.io/qwik';
import { Link, RequestHandler } from '@builder.io/qwik-city';
import { authorizedFetch, validateAccessToken } from '../../../shared/auth.service';

export interface Store {
  isVerified: boolean;
  loading: boolean;
  resent: boolean;
  email: string;
}

export const onGet: RequestHandler = async ({ cookie, redirect }) => {
  const validAccessToken = await validateAccessToken(cookie);
  if (!validAccessToken) {
    throw redirect(302, '/');
  }
};

export default component$(() => {
  const store = useStore<Store>({
    isVerified: false,
    loading: true,
    resent: false,
    email: '',
  });

  useVisibleTask$(() => {
    authorizedFetch(`${process.env.CLIENTSIDE_API_DOMAIN}/api/v1/auth/verified`).then(async (response) => {
      const { verified, email } = await response.json();
      store.isVerified = verified;
      store.loading = false;
      store.email = email;
    });
  });

  return (
    <div class="flex flex-col h-[calc(100vh-64px)]">
      <div class="flex flex-1 content-center justify-center items-center">
        <div class="w-full max-w-md">
          <div class="w-full p-5 bg-base-200 rounded content-center border border-black/[.15] shadow-md">
            <div class="prose prose-slate">
              <h1 class="m-0">Thanks for register!</h1>
              {store.loading && <span class="m-auto loading loading-ring loading-lg"></span>}
              {!store.loading && !store.isVerified && (
                <>
                  <p class="mt-4">
                    To keep your account secure, we need to verify your email address.
                  </p>
                  <p class="mt-2">
                    We sent an email to <code class="font-bold">{store.email}</code> to complete
                    the process.
                  </p>
                  <p class="mt-2 mb-5">If you don't see the email, please check your spam folder or contact our support team for help.</p>
                  <div class="form-control w-full max-w-xs inline-flex">
                    <br />
                    {store.resent && <p class="mt-2 mb-8">Verification email has been sent!</p>}
                    <button
                      class="btn btn-primary"
                      onClick$={async () => {
                        authorizedFetch(`${process.env.CLIENTSIDE_API_DOMAIN}/api/v1/auth/resend`).then(() => {
                          store.resent = true;
                        });
                      }}
                    >
                      Resend verification email
                    </button>
                  </div>
                </>
              )}
              {!store.loading && store.isVerified && (
                <>
                  <p class="mt-2 mb-8">Your account is verified</p>
                  <div class="form-control w-full max-w-xs inline-flex">
                    <br />
                    <Link href="/" class="btn btn-primary">
                      Go back
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
