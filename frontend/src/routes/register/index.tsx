import { component$, useStore } from '@builder.io/qwik';
import { RequestHandler, useNavigate } from '@builder.io/qwik-city';
import { ThemeSwitcher } from '~/components/theme-switcher/theme-switcher';

export interface Store {
  name: string;
  email: string;
  password: string;
  passwordVisible: boolean;
}

export const PasswordVisible = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width={1.5}
      stroke="currentColor"
      className="w-6 h-6"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
      />
    </svg>
  );
};

export const PasswordMasked = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width={1.5}
      stroke="currentColor"
      className="w-6 h-6"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
      />
      <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
};

export default component$(() => {
  const navigate = useNavigate();

  const store = useStore<Store>({
    name: '',
    email: '',
    password: '',
    passwordVisible: false,
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
              <h1>Create an account</h1>
              <div className="form-control w-full max-w-xs inline-flex">
                <label className="label">
                  <span className="label-text text-xs font-semibold">DISPLAY NAME</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full max-w-xs focus:outline-0 dark:bg-base-300"
                  value={store.name}
                  onInput$={(event) => (store.name = (event.target as HTMLInputElement).value)}
                />
                <br />
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
                <div className="flex items-center relative">
                  <input
                    type={store.passwordVisible ? 'text' : 'password'}
                    className="input input-bordered w-full max-w-xs focus:outline-0 dark:bg-base-300"
                    value={store.password}
                    onInput$={(event) =>
                      (store.password = (event.target as HTMLInputElement).value)
                    }
                  />

                  <span
                    className="absolute right-2.5 cursor-pointer flex items-center"
                    onClick$={() => {
                      store.passwordVisible = !store.passwordVisible;
                    }}
                  >
                    <div
                      class="tooltip tooltip-right"
                      data-tip={store.passwordVisible ? 'Hide password' : 'Show password'}
                    >
                      {store.passwordVisible ? <PasswordVisible /> : <PasswordMasked />}
                    </div>
                  </span>
                </div>
                <label className="label">
                  <span className="label-text text-xs text-left">
                    Passwords must contain at least eight characters, including at least 1 letter
                    and 1 number.
                  </span>
                </label>

                <br />
                <button
                  class="btn btn-primary"
                  onClick$={() => {
                    fetch(`${process.env.API_DOMAIN}/api/v1/auth/signup`, {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                        name: store.name,
                        email: store.email,
                        password: store.password,
                      }),
                    }).then((res) => {
                      if (res.status === 201) {
                        navigate.path = '/';
                      }
                    });
                  }}
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export const onGet: RequestHandler = async ({ response }) => {
  throw response.redirect('/');
};
