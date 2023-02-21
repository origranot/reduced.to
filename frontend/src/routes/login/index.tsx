import { component$, useStore } from '@builder.io/qwik';
import { RequestHandler } from '@builder.io/qwik-city';
import { ThemeSwitcher } from '~/components/theme-switcher/theme-switcher';
import { isAuthorized } from '~/shared/auth.service';

export interface Store {
  email: string;
  password: string;
}

export default component$(() => {
  const store = useStore<Store>({
    email: '',
    password: '',
  });

  return (
    <div class="min-h-screen flex flex-col register-bg">
      <div class="flex justify-end m-4">
        <ThemeSwitcher />
      </div>
      <div class="flex flex-1 content-center justify-center items-center">
        <div class="w-96 max-w-md">
          <div className="w-full p-5 bg-base-200 rounded content-center border border-black/[.15] shadow-md">
            <div class="prose prose-slate">
              <h1 className="m-0">Welcome back!</h1>
              <p className="mt-2 mb-8">We're so excited to see you again!</p>
              <div className="form-control w-full max-w-xs inline-flex">
                <label className="label">
                  <span className="label-text text-xs font-semibold">EMAIL</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full max-w-xs focus:outline-0 dark:bg-base-300"
                  value={store.email}
                  onInput$={(event) => (store.email = (event.target as HTMLInputElement).value)}
                />
                <br />
                <label className="label">
                  <span className="label-text text-xs font-semibold">PASSWORD</span>
                </label>
                <input
                  type={'password'}
                  className="input input-bordered w-full max-w-xs focus:outline-0 dark:bg-base-300"
                  value={store.password}
                  onInput$={(event) => (store.password = (event.target as HTMLInputElement).value)}
                />
                <label className="label">
                  <span className="label-text text-xs font-semibold">
                    Need an account?{' '}
                    <a href="/register" className="link link-primary">
                      Register
                    </a>
                  </span>
                </label>
                <br />
                <button
                  class="btn btn-primary"
                  onClick$={async () => {
                    fetch(`${process.env.API_DOMAIN}/api/v1/auth/login`, {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      credentials: 'include',
                      body: JSON.stringify({
                        email: store.email,
                        password: store.password,
                      }),
                    }).then(async (response) => {
                      if (response.ok) {
                        //Temporary solution until CSS loading is fixed, should be handled with useNavigate in the future
                        window.location.href = '/';
                      }
                    });
                  }}
                >
                  Log In
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export const onGet: RequestHandler = async ({ response, cookie }) => {
  if (await isAuthorized(cookie)) {
    throw response.redirect('/');
  }
};
