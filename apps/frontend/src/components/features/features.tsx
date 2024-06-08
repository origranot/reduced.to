import { component$, useContext } from '@builder.io/qwik';
import { DARK_THEME } from '../theme-switcher/theme-switcher';
import { GlobalStore } from '../../context';

export const Features = component$(() => {
  const state = useContext(GlobalStore);
  return (
    <>
      <div class="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
        <div class="mx-auto text-center mb-10 lg:mb-14 max-w-lg">
          <h2 class="font-bold text-gray-800 dark:text-gray-200 text-3xl sm:text-5xl ">
            Optimize and Manage Your
            <span class="bg-clip-text bg-gradient-to-l from-blue-600 to-violet-600 text-transparent"> Links </span>
            with Ease
          </h2>
          <p class="mt-2 text-gray-600 dark:text-gray-400">
            Because your links deserve the best. Explore our powerful features designed for seamless link management and in-depth analytics.
          </p>
        </div>
        <div class="relative z-10 py-8 px-4 mx-auto space-y-12 max-w-screen-xl lg:space-y-20 sm:py-16 lg:px-6">
          <div class="gap-8 items-center lg:grid lg:grid-cols-2 xl:gap-16">
            <div class="text-gray-800 sm:text-lg dark:text-gray-200">
              <h1 class="mb-4 sm:text-3xl text-2xl tracking-tight font-extrabold text-gray-800 dark:text-gray-200">
                Easily Manage Your Links
              </h1>
              <h2 class="mb-8 font-light text-gray-600 dark:text-gray-400">
                Our dashboard provides a simple and intuitive interface for managing all your shortened links. Organize, edit, and track
                your links effortlessly with our powerful tools.
              </h2>
              <ul role="list" class="pt-8 my-7 space-y-5 border-t border-gray-300 dark:border-gray-700">
                <li class="flex space-x-3">
                  <svg
                    class="flex-shrink-0 w-5 h-5 text-indigo-600 dark:text-indigo-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                  <span class="text-base font-medium leading-tight text-gray-900 dark:text-white">Comprehensive link management</span>
                </li>
                <li class="flex space-x-3">
                  <svg
                    class="flex-shrink-0 w-5 h-5 text-indigo-600 dark:text-indigo-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                  <span class="text-base font-medium leading-tight text-gray-900 dark:text-white">Custom UTM builder</span>
                </li>
                <li class="flex space-x-3">
                  <svg
                    class="flex-shrink-0 w-5 h-5 text-indigo-600 dark:text-indigo-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                  <span class="text-base font-medium leading-tight text-gray-900 dark:text-white">Password protected links</span>
                </li>
                <li class="flex space-x-3">
                  <svg
                    class="flex-shrink-0 w-5 h-5 text-indigo-600 dark:text-indigo-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                  <span class="text-base font-medium leading-tight text-gray-900 dark:text-white">Branded links</span>
                </li>
                <li class="flex space-x-3">
                  <svg
                    class="flex-shrink-0 w-5 h-5 text-indigo-600 dark:text-indigo-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                  <span class="text-base font-medium leading-tight text-gray-900 dark:text-white">User-friendly interface</span>
                </li>
                <li class="flex space-x-3">
                  <svg
                    class="flex-shrink-0 w-5 h-5 text-indigo-600 dark:text-indigo-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                  <span class="text-base font-medium leading-tight text-gray-900 dark:text-white">Secure and reliable</span>
                </li>
              </ul>
            </div>
            {state.theme === DARK_THEME ? (
              <div class="mockup-browser border border-base-300 hidden mb-4 w-full lg:mb-0 lg:block bg-slate-900">
                <div class="mockup-browser-toolbar">
                  <div class="input border border-base-300">https://reduced.to/dashboard</div>
                </div>
                <img
                  class="w-full lg:mb-0 lg:flex rounded-lg"
                  src="/images/features/dashboard-dark.png"
                  height={1200}
                  width={1800}
                  alt="Dashboard feature dark mode preview"
                />
              </div>
            ) : (
              <div class="mockup-browser border border-base-300 hidden mb-4 w-full lg:mb-0 lg:block bg-slate-100">
                <div class="mockup-browser-toolbar">
                  <div class="input border border-base-300">https://reduced.to/dashboard</div>
                </div>
                <img
                  class="hidden mb-4 w-full lg:mb-0 lg:flex rounded-lg"
                  src="/images/features/dashboard.png"
                  height={1200}
                  width={1800}
                  alt="Dashboard feature preview"
                />
              </div>
            )}
          </div>
          <div class="gap-8 items-center lg:grid lg:grid-cols-2 xl:gap-16">
            {state.theme === DARK_THEME ? (
              <div class="mockup-browser border border-base-300 hidden mb-4 w-full lg:mb-0 lg:block bg-slate-900">
                <div class="mockup-browser-toolbar">
                  <div class="input border border-base-300">https://reduced.to</div>
                </div>
                <img
                  class="hidden mb-4 w-full lg:mb-0 lg:flex rounded-lg"
                  src="/images/features/analytics-dark.png"
                  height={1200}
                  width={1800}
                  alt="Analytics feature dark mode preview"
                />
              </div>
            ) : (
              <div class="mockup-browser border border-base-300 hidden mb-4 w-full lg:mb-0 lg:block bg-slate-100">
                <div class="mockup-browser-toolbar">
                  <div class="input border border-base-300">https://reduced.to</div>
                </div>
                <img
                  class="hidden mb-4 w-full lg:mb-0 lg:flex rounded-lg"
                  src="/images/features/analytics.png"
                  height={1200}
                  width={1800}
                  alt="Analytics feature preview"
                />
              </div>
            )}
            <div class="text-gray-800 sm:text-lg dark:text-gray-200">
              <h1 class="mb-4 sm:text-3xl text-2xl tracking-tight font-extrabold text-gray-800 dark:text-gray-200">
                Advanced analytics for your links
              </h1>
              <h2 class="mb-8 font-light text-gray-600 dark:text-gray-400">
                The analytics dashboard provides detailed insights into your link performance. Track clicks, geographic, and devices data to
                optimize your link management strategy.
              </h2>
              <ul role="list" class="pt-8 my-7 space-y-5 border-t border-gray-300 dark:border-gray-700">
                <li class="flex space-x-3">
                  <svg
                    class="flex-shrink-0 w-5 h-5 text-indigo-600 dark:text-indigo-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                  <span class="text-base font-medium leading-tight text-gray-900 dark:text-white">Dynamic reports and dashboards</span>
                </li>
                <li class="flex space-x-3">
                  <svg
                    class="flex-shrink-0 w-5 h-5 text-indigo-600 dark:text-indigo-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                  <span class="text-base font-medium leading-tight text-gray-900 dark:text-white">Comprehensive analytics</span>
                </li>
                <li class="flex space-x-3">
                  <svg
                    class="flex-shrink-0 w-5 h-5 text-indigo-600 dark:text-indigo-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                  <span class="text-base font-medium leading-tight text-gray-900 dark:text-white">Real-time data</span>
                </li>
                <li class="flex space-x-3">
                  <svg
                    class="flex-shrink-0 w-5 h-5 text-indigo-600 dark:text-indigo-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                  <span class="text-base font-medium leading-tight text-gray-900 dark:text-white">Detailed insights</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
});
