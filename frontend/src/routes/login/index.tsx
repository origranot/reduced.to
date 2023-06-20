import { component$, Slot } from '@builder.io/qwik';
import { Form, globalAction$, Link, RequestHandler, z, zod$ } from '@builder.io/qwik-city';
import {
  ACCESS_COOKIE_NAME,
  setTokensAsCookies,
  validateAccessToken,
} from '../../shared/auth.service';
import { useAuthSignin } from '../plugin@auth';

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





export default component$(() => {
  const action = useLogin();
  return (
    <div class="min-h-screen flex flex-col register-bg">
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
              <ProviderLogin />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
});



export const ProviderLogin = component$(() => {
  const authSignIn = useAuthSignin();
  return <>
  <p class={'leading-none m-5'}>or</p>
  <div class={'form-control w-full max-w-xs inline-flex space-y-4'}>
    <Form action={authSignIn} class="form-control inline-flex">
      <input type="hidden" name="providerId" value="google" />
      <input type="hidden" name="options.callbackUrl" />
      <LogInButton providerName='Google' >
        <div q:slot='login-icon-button-slot'>{JSX_GOOGLE_ICON}</div>
      </LogInButton>
    </Form>
    <Form action={authSignIn} class="form-control inline-flex">
      <input type="hidden" name="providerId" value="github" />
      <input type="hidden" name="options.callbackUrl" />
      <LogInButton providerName='GitHub'>
        <div q:slot='login-icon-button-slot'>{JSX_GITHUB_ICON}</div>
      </LogInButton>
    </Form>
  </div>
  </>
});


export const LogInButton = component$((props: {providerName: 'GitHub' | 'Google'}) => {
  return <button class={'bg-white text-black grid grid-cols-[32px_1fr] rounded-lg p-2 items-center hover:bg-gray-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white'}> 
    <span class={''}>
      <Slot key={'login-icon-button-slot'} name='login-icon-button-slot'  />
    </span>
    <p class={'font-semibold tracking-tight m-0'}>{props.providerName}</p>
  </button>
});


export const JSX_GOOGLE_ICON =  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="32" height="32" viewBox="0 0 512 512" style="shape-rendering:geometricPrecision;text-rendering:geometricPrecision;image-rendering:optimizeQuality;fill-rule:evenodd;clip-rule:evenodd"><path style="opacity:.986" fill="#e94134" d="M121.5 208.5a3957.606 3957.606 0 0 1-83-65C74.157 75.97 129.158 32.803 203.5 14c81.766-17.307 154.766.36 219 53 2.454 1.74 3.954 3.907 4.5 6.5L357.5 143c-1 .667-2 .667-3 0-32.445-29.144-70.445-40.811-114-35-58.488 11.329-98.155 44.829-119 100.5Z"/><path style="opacity:.989" fill="#f9ba08" d="M38.5 143.5a3957.606 3957.606 0 0 0 83 65c-7.574 23.557-9.408 47.557-5.5 72a578.182 578.182 0 0 0 5.5 23 1922.588 1922.588 0 0 0-83 64C7.38 304.038 3.214 238.705 26 171.5a206.575 206.575 0 0 1 12.5-28Z"/><path style="opacity:.99" fill="#4285f3" d="m425.5 443.5-80-63c26.791-18.483 43.124-43.816 49-76h-134v-96c78.237-.332 156.404.002 234.5 1 9.728 56.114 3.728 110.447-18 163-12.386 27.207-29.553 50.873-51.5 71Z"/><path style="opacity:.988" fill="#34a753" d="M121.5 303.5c16.149 43.091 45.482 73.591 88 91.5 47.647 16.069 92.981 11.236 136-14.5l80 63c-34.047 30.85-74.047 49.684-120 56.5-94.918 13.48-174.084-15.353-237.5-86.5a237.262 237.262 0 0 1-29.5-46 1922.588 1922.588 0 0 1 83-64Z"/></svg>
export const JSX_GITHUB_ICON = <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="32" height="32" viewBox="0 0 30 30"><path d="M15,3C8.373,3,3,8.373,3,15c0,5.623,3.872,10.328,9.092,11.63C12.036,26.468,12,26.28,12,26.047v-2.051 c-0.487,0-1.303,0-1.508,0c-0.821,0-1.551-0.353-1.905-1.009c-0.393-0.729-0.461-1.844-1.435-2.526 c-0.289-0.227-0.069-0.486,0.264-0.451c0.615,0.174,1.125,0.596,1.605,1.222c0.478,0.627,0.703,0.769,1.596,0.769 c0.433,0,1.081-0.025,1.691-0.121c0.328-0.833,0.895-1.6,1.588-1.962c-3.996-0.411-5.903-2.399-5.903-5.098 c0-1.162,0.495-2.286,1.336-3.233C9.053,10.647,8.706,8.73,9.435,8c1.798,0,2.885,1.166,3.146,1.481C13.477,9.174,14.461,9,15.495,9 c1.036,0,2.024,0.174,2.922,0.483C18.675,9.17,19.763,8,21.565,8c0.732,0.731,0.381,2.656,0.102,3.594 c0.836,0.945,1.328,2.066,1.328,3.226c0,2.697-1.904,4.684-5.894,5.097C18.199,20.49,19,22.1,19,23.313v2.734 c0,0.104-0.023,0.179-0.035,0.268C23.641,24.676,27,20.236,27,15C27,8.373,21.627,3,15,3z"></path></svg>