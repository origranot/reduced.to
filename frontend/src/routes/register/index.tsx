import { component$, useStore } from '@builder.io/qwik';
import { Form, globalAction$, RequestHandler, z, zod$ } from '@builder.io/qwik-city';
import {
  ACCESS_COOKIE_NAME,
  setTokensAsCookies,
  validateAccessToken,
} from '../../shared/auth.service';

interface RegisterStore {
  passwordVisible: boolean;
}

export const onGet: RequestHandler = async ({ cookie, redirect }) => {
  const acccessToken = cookie.get(ACCESS_COOKIE_NAME)?.value;
  if (await validateAccessToken(acccessToken)) {
    throw redirect(302, '/');
  }
};

export const useRegister = globalAction$(
  async ({ displayName, email, password }, { fail, headers, cookie }) => {
    const data: Response = await fetch(`${process.env.API_DOMAIN}/api/v1/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: displayName,
        email: email,
        password: password,
      }),
    });

    const { accessToken, refreshToken, message } = await data.json();

    const errorMessage = message
      ? message[0]
      : 'There was an error creating your account. Please try again.';

    if (!data.ok || !accessToken || !refreshToken) {
      return fail(400, {
        message: errorMessage,
      });
    }

    setTokensAsCookies(accessToken, refreshToken, cookie);

    // Redirect using location header instead of redirect becuase we need to reload the routeLoader to get the new user data
    headers.set('location', '/register/verify');

    return {
      message: 'Account created successfully',
    };
  },
  zod$({
    displayName: z
      .string({
        required_error: 'Display name is required',
      })
      .min(3, {
        message: 'Display name must be at least 3 characters',
      })
      .max(25, {
        message: 'Display name must be less than 25 characters',
      }),
    email: z
      .string({
        required_error: 'Email is required',
      })
      .email({
        message: 'Please enter a valid email',
      }),
    password: z
      .string({
        required_error: 'Password is required',
      })
      .min(6, {
        message: 'Password must be at least 6 characters',
      })
      .max(25, {
        message: 'Password must be less than 25 characters',
      })
      .regex(/^(?=.*[0-9])(?=.*[a-zA-Z])(?!.* ).{6,}$/, {
        message:
          'Password must contain at least six characters, including at least 1 letter and 1 number',
      }),
  })
);

export const PasswordVisible = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width={1.5}
      stroke="currentColor"
      class="w-6 h-6"
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
      class="w-6 h-6"
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
  const store = useStore<RegisterStore>({
    passwordVisible: false,
  });

  const action = useRegister();

  return (
    <div class="min-h-screen flex flex-col register-bg">
      <div class="flex flex-1 content-center justify-center items-center">
        <div class="w-96 max-w-md">
          <div class="w-full p-5 bg-base-200 rounded content-center border border-black/[.15] shadow-md">
            <div class="prose prose-slate">
              <h1>Create an account</h1>
              <Form action={action} class="form-control w-full max-w-xs inline-flex">
                <label class="label">
                  <span class="label-text text-xs font-semibold">DISPLAY NAME</span>
                </label>
                <input
                  name="displayName"
                  type="text"
                  class="input input-bordered w-full max-w-xs focus:outline-0 dark:bg-base-300"
                />
                {action.value?.fieldErrors?.displayName && (
                  <span class="text-error text-left">{action.value?.fieldErrors?.displayName}</span>
                )}{' '}
                <br />
                <label class="label">
                  <span class="label-text text-xs font-semibold">EMAIL</span>
                </label>
                <input
                  name="email"
                  type="text"
                  class="input input-bordered w-full max-w-xs focus:outline-0 dark:bg-base-300"
                />
                {action.value?.fieldErrors?.email && (
                  <span class="text-error text-left">{action.value?.fieldErrors?.email}</span>
                )}{' '}
                <br />
                <label class="label">
                  <span class="label-text text-xs font-semibold">PASSWORD</span>
                </label>
                <div class="flex items-center relative">
                  <input
                    name="password"
                    type={store.passwordVisible ? 'text' : 'password'}
                    class="input input-bordered w-full max-w-xs focus:outline-0 dark:bg-base-300"
                    autoComplete="on"
                  />

                  <span
                    class="absolute right-2.5 cursor-pointer flex items-center"
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
                <label class="label">
                  <span
                    class={`label-text text-xs text-left ${
                      action.value?.fieldErrors?.password ? 'text-error text-left' : ''
                    }`}
                  >
                    Password must contain at least six characters, including at least 1 letter and 1
                    number.
                  </span>
                </label>
                <br />
                <button
                  class={`btn btn-primary ${action.isRunning ? ' loading' : ''}`}
                  type="submit"
                >
                  Continue
                </button>
                {action.value?.message && (
                  <span class="text-error text-left">{action.value.message}</span>
                )}
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
