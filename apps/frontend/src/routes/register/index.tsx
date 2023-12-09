import { component$, useStore } from '@builder.io/qwik';
import { DocumentHead, Form, Link, RequestHandler, globalAction$, z, zod$ } from '@builder.io/qwik-city';
import { setTokensAsCookies, validateAccessToken } from '../../shared/auth.service';

interface RegisterStore {
  passwordVisible: boolean;
}

export const onGet: RequestHandler = async ({ cookie, redirect }) => {
  const validAccessToken = await validateAccessToken(cookie);
  if (validAccessToken) {
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

    const errorMessage = message ? message[0] : 'There was an error creating your account. Please try again.';

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
        message: 'Email is not valid',
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
        message: 'Password must contain at least six characters, including at least 1 letter and 1 number',
      }),
    policies: z
      .string({
        required_error: 'You must agree to the privacy policy.',
      })
      .min(1, {
        message: 'You must agree to the privacy policy.',
      }),
  })
);

export const PasswordVisible = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width={1.5} stroke="currentColor" class="w-6 h-6">
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
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width={1.5} stroke="currentColor" class="w-6 h-6">
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
    <div class="flex flex-col h-[calc(100vh-64px)]">
      <div class="flex flex-1 content-center justify-center items-center">
        <main class="w-full max-w-md mx-auto p-6">
          <div class="mt-7 bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-gray-800 dark:border-gray-700">
            <div class="p-4 sm:p-7">
              <div class="text-center">
                <h1 class="block text-2xl font-bold text-gray-800 dark:text-white">Sign up</h1>
                <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  Already have an account?{' '}
                  <Link
                    class="text-blue-600 decoration-2 hover:underline font-medium dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                    href="/login"
                  >
                    Sign in here
                  </Link>
                </p>
              </div>

              <div class="mt-5">
                <a
                  type="button"
                  class="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                  href={`${process.env.CLIENTSIDE_API_DOMAIN}/api/v1/auth/providers/google`}
                >
                  <svg class="w-4 h-auto" width="46" height="47" viewBox="0 0 46 47" fill="none">
                    <path
                      d="M46 24.0287C46 22.09 45.8533 20.68 45.5013 19.2112H23.4694V27.9356H36.4069C36.1429 30.1094 34.7347 33.37 31.5957 35.5731L31.5663 35.8669L38.5191 41.2719L38.9885 41.3306C43.4477 37.2181 46 31.1669 46 24.0287Z"
                      fill="#4285F4"
                    />
                    <path
                      d="M23.4694 47C29.8061 47 35.1161 44.9144 39.0179 41.3012L31.625 35.5437C29.6301 36.9244 26.9898 37.8937 23.4987 37.8937C17.2793 37.8937 12.0281 33.7812 10.1505 28.1412L9.88649 28.1706L2.61097 33.7812L2.52296 34.0456C6.36608 41.7125 14.287 47 23.4694 47Z"
                      fill="#34A853"
                    />
                    <path
                      d="M10.1212 28.1413C9.62245 26.6725 9.32908 25.1156 9.32908 23.5C9.32908 21.8844 9.62245 20.3275 10.0918 18.8588V18.5356L2.75765 12.8369L2.52296 12.9544C0.909439 16.1269 0 19.7106 0 23.5C0 27.2894 0.909439 30.8731 2.49362 34.0456L10.1212 28.1413Z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M23.4694 9.07688C27.8699 9.07688 30.8622 10.9863 32.5344 12.5725L39.1645 6.11C35.0867 2.32063 29.8061 0 23.4694 0C14.287 0 6.36607 5.2875 2.49362 12.9544L10.0918 18.8588C11.9987 13.1894 17.25 9.07688 23.4694 9.07688Z"
                      fill="#EB4335"
                    />
                  </svg>
                  Sign up with Google
                </a>

                <div class="py-3 flex items-center text-xs text-gray-400 uppercase before:flex-[1_1_0%] before:border-t before:border-gray-200 before:me-6 after:flex-[1_1_0%] after:border-t after:border-gray-200 after:ms-6 dark:text-gray-500 dark:before:border-gray-600 dark:after:border-gray-600">
                  Or
                </div>

                <Form action={action}>
                  <div class="grid gap-y-4">
                    <div>
                      <label for="displayName" class="block text-sm mb-2 text-left dark:text-white">
                        Display name
                      </label>
                      <div class="relative">
                        <input
                          type="text"
                          id="displayName"
                          name="displayName"
                          class="py-3 px-4 block w-full input input-bordered"
                          required
                          aria-describedby="display-name-error"
                        />
                        {action.value?.fieldErrors?.displayName && (
                          <span class="text-error float-left text-sm">{action.value?.fieldErrors?.displayName}</span>
                        )}
                      </div>
                    </div>
                    <div>
                      <label for="email" class="block text-sm mb-2 text-left dark:text-white">
                        Email
                      </label>
                      <div class="relative">
                        <input
                          type="email"
                          id="email"
                          name="email"
                          class="py-3 px-4 block w-full input input-bordered"
                          required
                          aria-describedby="email-error"
                        />
                      </div>
                      {action.value?.fieldErrors?.email && (
                        <span class="text-error float-left text-sm">{action.value?.fieldErrors?.email}</span>
                      )}
                    </div>
                    <div>
                      <label for="email" class="block text-sm mb-2 text-left dark:text-white">
                        Password
                      </label>
                      <div class="flex items-center relative">
                        <input
                          type={store.passwordVisible ? 'text' : 'password'}
                          id="password"
                          name="password"
                          class="py-3 px-4 block w-full input input-bordered"
                          required
                          aria-describedby="email-error"
                        />
                        <span
                          class="absolute right-2.5 cursor-pointer flex items-center"
                          onClick$={() => {
                            store.passwordVisible = !store.passwordVisible;
                          }}
                        >
                          <div class="tooltip tooltip-right" data-tip={store.passwordVisible ? 'Hide password' : 'Show password'}>
                            {store.passwordVisible ? <PasswordVisible /> : <PasswordMasked />}
                          </div>
                        </span>
                      </div>
                      <label class="label">
                        <span class={`label-text text-xs text-left ${action.value?.fieldErrors?.password ? 'text-error text-left' : ''}`}>
                          Password must contain at least six characters, <br />
                          including at least 1 letter and 1 number.
                        </span>
                      </label>
                    </div>
                    <div>
                      <div class="flex items-center">
                        <div class="flex">
                          <input id="policies" name="policies" type="checkbox" class="checkbox checkbox-sm" />
                        </div>
                        <div class="ms-3">
                          <label for="policies" class="text-sm dark:text-white">
                            I accept the{' '}
                            <a
                              class="text-blue-600 decoration-2 hover:underline font-medium dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                              href="/privacy-policy"
                              target="_blank"
                            >
                              Terms and Conditions
                            </a>
                          </label>
                        </div>
                      </div>
                      {action.value?.fieldErrors?.policies && (
                        <span class="label-text text-error float-left">{action.value.fieldErrors.policies}</span>
                      )}
                    </div>
                    <button
                      type="submit"
                      class="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                    >
                      {action.isRunning ? <span class="loading loading-spinner-small"></span> : 'Sign up'}
                    </button>
                    {action.value?.message && <span class="text-error text-left">{action.value.message}</span>}
                  </div>
                </Form>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: 'Reduced.to | Register',
  meta: [
    {
      name: 'title',
      content: 'Reduced.to | Register',
    },
    {
      name: 'description',
      content: 'Reduced.to | Create your Reduced.to account to manage your shorten links.',
    },
    {
      property: 'og:type',
      content: 'website',
    },
    {
      property: 'og:url',
      content: 'https://reduced.to/register',
    },
    {
      property: 'og:title',
      content: 'Reduced.to | Register',
    },
    {
      property: 'og:description',
      content: 'Reduced.to | Create your Reduced.to account to manage your shorten links.',
    },
    {
      property: 'twitter:card',
      content: 'summary',
    },
    {
      property: 'twitter:title',
      content: 'Reduced.to | Register',
    },
    {
      property: 'twitter:description',
      content: 'Reduced.to | Create your Reduced.to account to manage your shorten links.',
    },
  ],
};
