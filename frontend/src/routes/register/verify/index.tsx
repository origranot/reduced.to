import { component$, useStore, useVisibleTask$ } from '@builder.io/qwik';
import { Link, RequestHandler } from '@builder.io/qwik-city';
import { Loader } from '~/components/loader/loader';
import { ACCESS_COOKIE_NAME, authorizedFetch, validateAccessToken } from '~/shared/auth.service';

export interface Store {
  isVerified: boolean;
  loading: boolean;
  resent: boolean;
}

export const onGet: RequestHandler = async ({ cookie, redirect }) => {
  const acccessToken = cookie.get(ACCESS_COOKIE_NAME)?.value;
  if (!acccessToken || !(await validateAccessToken(acccessToken))) {
    throw redirect(302, '/');
  }
};

export default component$(() => {
  const store = useStore<Store>({
    isVerified: false,
    loading: true,
    resent: false,
  });

  useVisibleTask$(() => {
    authorizedFetch(`${process.env.API_DOMAIN}/api/v1/auth/verified`).then(async (response) => {
      const { verified } = await response.json();
      store.isVerified = verified;
      store.loading = false;
    });
  });

  return (
    <div class="min-h-screen flex flex-col register-bg">
      <div class="flex flex-1 content-center justify-center items-center">
        <div class="w-full max-w-md">
          <div class="w-full p-5 bg-base-200 rounded content-center border border-black/[.15] shadow-md">
            <div class="prose prose-slate">
              <h1 class="m-0">Thanks for register!</h1>
              <Loader visible={store.loading} />
              {!store.loading && !store.isVerified && (
                <>
                  <p class="mt-4">
                    To keep your account secure, we need to verify your email address. Check your
                    inbox for a message from us to complete the process.
                  </p>
                  <p class="mt-2 mb-5">
                    If you don't see the email, please check your spam folder or contact our support
                    team for help.
                  </p>
                  <div class="form-control w-full max-w-xs inline-flex">
                    <br />
                    {store.resent && <p class="mt-2 mb-8">Verification email has been sent!</p>}
                    <button
                      class="btn btn-primary"
                      onClick$={async () => {
                        authorizedFetch(`${process.env.API_DOMAIN}/api/v1/auth/resend`).then(() => {
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
