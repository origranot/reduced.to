import { component$, useStore } from '@builder.io/qwik';
import { RequestHandler, useNavigate } from '@builder.io/qwik-city';
import { isAuthorized } from '../../shared/auth.service';

interface LoginStore {
  email: string;
  password: string;
  loading: boolean;
}

export const onGet: RequestHandler = async ({ cookie, redirect }) => {
  if (await isAuthorized(cookie)) {
    throw redirect(302, '/');
  }
};

export default component$(() => {
  const loginStore = useStore<LoginStore>({
    email: '',
    password: '',
    loading: false,
  });

  const navigate = useNavigate();

  return (
    <div class="min-h-screen flex flex-col register-bg">
      <div class="flex flex-1 content-center justify-center items-center">
        <div class="w-96 max-w-md">
          <div class="w-full p-5 bg-base-200 rounded content-center border border-black/[.15] shadow-md">
            <div class="prose prose-slate">
              <h1 class="m-0">Welcome back!</h1>
              <p class="mt-2 mb-8">We're so excited to see you again!</p>
              <div class="form-control w-full max-w-xs inline-flex">
                <label class="label">
                  <span class="label-text text-xs font-semibold">EMAIL</span>
                </label>
                <input
                  type="text"
                  class="input input-bordered w-full max-w-xs focus:outline-0 dark:bg-base-300"
                  value={loginStore.email}
                  onInput$={(event) =>
                    (loginStore.email = (event.target as HTMLInputElement).value)
                  }
                />
                <br />
                <label class="label">
                  <span class="label-text text-xs font-semibold">PASSWORD</span>
                </label>
                <input
                  type={'password'}
                  class="input input-bordered w-full max-w-xs focus:outline-0 dark:bg-base-300"
                  value={loginStore.password}
                  onInput$={(event) =>
                    (loginStore.password = (event.target as HTMLInputElement).value)
                  }
                />
                <label class="label">
                  <span class="label-text text-xs font-semibold">
                    Need an account?{' '}
                    <a href="/register" class="link link-primary">
                      Register
                    </a>
                  </span>
                </label>
                <br />
                <button
                  class={`btn btn-primary ${loginStore.loading ? 'loading' : ''}`}
                  onClick$={async () => {
                    loginStore.loading = true;
                    fetch(`${process.env.API_DOMAIN}/api/v1/auth/login`, {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      credentials: 'include',
                      body: JSON.stringify({
                        email: loginStore.email,
                        password: loginStore.password,
                      }),
                    })
                      .then(async (response) => {
                        if (response.ok) {
                          navigate('/');
                        }
                      })
                      .finally(() => {
                        loginStore.loading = false;
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
