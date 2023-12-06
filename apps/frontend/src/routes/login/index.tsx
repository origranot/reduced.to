import { component$ } from '@builder.io/qwik';
import { DocumentHead, Form, globalAction$, Link, RequestHandler, z, zod$ } from '@builder.io/qwik-city';
import { setTokensAsCookies, validateAccessToken } from '../../shared/auth.service';

export const onGet: RequestHandler = async ({ cookie, redirect }) => {
  const validAccessToken = await validateAccessToken(cookie);
  if (validAccessToken) {
    throw redirect(302, '/');
  }
};

export const useLogin = globalAction$(
  async ({ email, password }, { fail, cookie, headers }) => {
    const data = await fetch(`${process.env.API_DOMAIN}/api/v1/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const { accessToken, refreshToken } = await data.json();

    if (!data.ok || !accessToken || !refreshToken) {
      return fail(401, {
        message: 'Invalid email or password',
      });
    }

    setTokensAsCookies(accessToken, refreshToken, cookie);

    // Redirect using location header instead of native redirect becuase we need to reload the routeLoader to get the new user data
    headers.set('location', '/dashboard');
  },
  zod$({
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
      }),
  })
);

export default component$(() => {
  const action = useLogin();

  return (
    <div class="flex flex-col h-[calc(100vh-64px)]">
      <div class="flex flex-1 content-center justify-center items-center">
        <div class="w-full max-w-md mx-auto p-6">
          <div class="mt-7 bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-gray-800 dark:border-gray-700">
            <div class="p-4 sm:p-7">
              <div class="text-center">
                <h1 class="block text-2xl font-bold text-gray-800 dark:text-white">Sign in</h1>
                <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  Don't have an account yet?{' '}
                  <Link
                    class="text-blue-600 decoration-2 hover:underline font-medium dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                    href="/register"
                  >
                    Sign up here
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
                  Sign in with Google
                </a>

                <div class="py-3 flex items-center text-xs text-gray-400 uppercase before:flex-[1_1_0%] before:border-t before:border-gray-200 before:me-6 after:flex-[1_1_0%] after:border-t after:border-gray-200 after:ms-6 dark:text-gray-500 dark:before:border-gray-600 dark:after:border-gray-600">
                  Or
                </div>
                <Form action={action}>
                  <div class="grid gap-y-4">
                    <div>
                      <label for="email" class="block text-sm mb-2 dark:text-white text-left">
                        Email address
                      </label>
                      <input type="email" id="email" name="email" class="py-3 px-4 w-full input input-bordered" required />
                      {action.value?.fieldErrors?.email && (
                        <span class="text-error float-left text-sm">{action.value?.fieldErrors?.email}</span>
                      )}
                    </div>
                    <div>
                      <div class="flex justify-between items-center">
                        <label for="password" class="block text-sm mb-2 dark:text-white">
                          Password
                        </label>
                        {/* <Link
                          class="text-sm text-blue-600 decoration-2 hover:underline font-medium dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                          href="/forgot-password"
                        >
                          Forgot password?
                        </Link> */}
                      </div>
                      <input type="password" id="password" name="password" class="py-3 px-4 w-full input input-bordered" required />
                    </div>
                    <button type="submit" class="btn btn-primary">
                      {action.isRunning ? <span class="loading loading-spinner-small"></span> : 'Sign In'}
                    </button>
                    {(action.value?.message || action.value?.fieldErrors?.password) && (
                      <span class="text-error text-left">Invalid email or password</span>
                    )}
                  </div>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: 'Reduced.to | Login',
  meta: [
    {
      name: 'title',
      content: 'Reduced.to | Login',
    },
    {
      name: 'description',
      content: 'Login to your Reduced.to account to manage your shortened links.',
    },
    {
      property: 'og:type',
      content: 'website',
    },
    {
      property: 'og:url',
      content: 'https://reduced.to/login',
    },
    {
      property: 'og:title',
      content: 'Reduced.to | Login',
    },
    {
      property: 'og:description',
      content: 'Login to your Reduced.to account to manage your shortened links.',
    },
    {
      property: 'twitter:card',
      content: 'summary',
    },
    {
      property: 'twitter:title',
      content: 'Reduced.to | Login',
    },
    {
      property: 'twitter:description',
      content: 'Login to your Reduced.to account to manage your shortened links.',
    },
  ],
};
