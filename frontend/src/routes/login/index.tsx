import { component$, useContext, useStore } from '@builder.io/qwik';
import { RequestHandler, useNavigate } from '@builder.io/qwik-city';
import { GlobalStore } from '~/context';
import { checkAuth, getUser, login, setCookie } from '~/shared/auth.service';

export interface Store {
  email: string;
  password: string;
  loading: boolean;
}

export default component$(() => {
  const navigate = useNavigate();

  const store = useStore<Store>({
    email: '',
    password: '',
    loading: false,
  });

  const globalStore = useContext(GlobalStore);

  return (
    <div class="min-h-screen flex flex-col register-bg">
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
                    store.loading = true;
                    login(store.email, store.password).then(async (v) => {
                      const token = await v.json();
                      setCookie('s_id', token.access_token, 1);
                      globalStore.user = getUser();
                      store.loading = false;
                      navigate.path = '/';
                    });
                  }}
                >
                  {store.loading ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="38"
                      height="38"
                      viewBox="0 0 38 38"
                    >
                      <defs>
                        <linearGradient x1="8.042%" y1="0%" x2="65.682%" y2="23.865%" id="a">
                          <stop stop-color="#fff" stop-opacity="0" offset="0%" />
                          <stop stop-color="#fff" stop-opacity=".631" offset="63.146%" />
                          <stop stop-color="#fff" offset="100%" />
                        </linearGradient>
                      </defs>
                      <g fill="none" fill-rule="evenodd">
                        <g transform="translate(1 1)">
                          <path
                            d="M36 18c0-9.94-8.06-18-18-18"
                            id="Oval-2"
                            stroke="url(#a)"
                            stroke-width="2"
                          >
                            <animateTransform
                              attributeName="transform"
                              type="rotate"
                              from="0 18 18"
                              to="360 18 18"
                              dur="0.9s"
                              repeatCount="indefinite"
                            />
                          </path>
                          <circle fill="#fff" cx="36" cy="18" r="1">
                            <animateTransform
                              attributeName="transform"
                              type="rotate"
                              from="0 18 18"
                              to="360 18 18"
                              dur="0.9s"
                              repeatCount="indefinite"
                            />
                          </circle>
                        </g>
                      </g>
                    </svg>
                  ) : (
                    'Log in'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export const onGet: RequestHandler = async ({ request, response }) => {
  const isAuthorized = await checkAuth(request.headers.get('cookie'));

  if (isAuthorized) {
    //Redirect because already logged in
    throw response.redirect('/');
  }
};
