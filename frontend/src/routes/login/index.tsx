import { component$ } from '@builder.io/qwik';
import { Form, globalAction$, Link, RequestHandler, z, zod$ } from '@builder.io/qwik-city';
import {
  ACCESS_COOKIE_NAME,
  setTokensAsCookies,
  validateAccessToken,
} from '../../shared/auth.service';

export const onGet: RequestHandler = async ({ cookie, redirect }) => {
  const acccessToken = cookie.get(ACCESS_COOKIE_NAME)?.value;
  if (await validateAccessToken(acccessToken)) {
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

    // Redirect using location header instead of redirect becuase we need to reload the routeLoader to get the new user data
    headers.set('location', '/');
  },
  zod$({
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
      }),
  })
);

/**
 * @description
 * This component is used to render the Google Login button and handle the login logic with Google.
 * To create a Google I use this guide: https://developers.google.com/identity/gsi/web/tools/configurator
 * 
 */

export const GoogleLogin = component$(() => {
  return <>
    <div>
      <p>or</p>
      <div>
        <div id="g_id_onload"
            data-client_id="227254915549-j3gsadfbm3st9k8i8jdfugqtn0vqpvjf.apps.googleusercontent.com"
            data-context="signin"
            data-ux_mode="popup"
            data-login_uri="http://localhost:5173"
            data-itp_support="true">
        </div>

        <div class="g_id_signin"
            data-type="standard"
            data-shape="pill"
            data-theme="filled_blue"
            data-text="signin_with"
            data-size="large"
            data-logo_alignment="left">
        </div>
      </div>
    </div>
  </>
});

export default component$(() => {
  const action = useLogin();

  return (
    <div class="flex flex-col h-[calc(100vh-64px)]">
      <div class="flex flex-1 content-center justify-center items-center">
        <div class="w-96 max-w-md">
          <div class="w-full p-5 bg-base-200 rounded content-center border border-black/[.15] shadow-md">
            <div class="prose prose-slate">
              <h1 class="m-0">Welcome back!</h1>
              <p class="mt-2 mb-8">We're so excited to see you again!</p>
              <Form action={action} class="form-control w-full max-w-xs inline-flex">
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
                <input
                  name="password"
                  type="password"
                  class="input input-bordered w-full max-w-xs focus:outline-0 dark:bg-base-300"
                />{' '}
                {action.value?.fieldErrors?.password && (
                  <span class="text-error text-left">{action.value?.fieldErrors?.password}</span>
                )}
                <label class="label">
                  <span class="label-text text-xs font-semibold">
                    Need an account?{' '}
                    <Link href="/register" class="link link-primary">
                      Register
                    </Link>
                  </span>
                </label>
                <br />
                <button class={`btn btn-primary ${action.isRunning ? 'loading' : ''}`}>
                  Log In
                </button>
                {action.value?.message && (
                  <span class="text-error text-left">Invalid email or password</span>
                )}
              </Form>
            </div>
            <GoogleLogin />
          </div>
        </div>
      </div>
    </div>
  );
});

