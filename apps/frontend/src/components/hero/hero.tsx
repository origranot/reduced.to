import { component$ } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';
import { IoLogoDocker } from '@qwikest/icons/ionicons';
import { useGetCurrentUser } from '../../routes/layout';

export const Hero = component$(() => {
  const user = useGetCurrentUser();

  return (
    <div class="pt-24 pb-10">
      <div class="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 mt-[-40px]">
        {/* <!-- Announcement Github Banner --> */}
        <div class="flex justify-center">
          <a
            class="inline-flex items-center gap-x-2 bg-white z-10 border border-gray-600 text-xs text-gray-600 p-2 px-3 rounded-full hover:border-gray-900 dark:bg-slate-900 dark:border-neutral-700 dark:hover:border-neutral-600 dark:text-slate-200"
            href="https://reduced.to/git"
            target="_blank"
          >
            Don't forget to star us on GitHub!
            <span class="flex items-center gap-x-1">
              <span class="border-s border-gray-200 text-blue-600 ps-2 dark:text-blue-500 dark:border-neutral-700">🌟</span>
            </span>
          </a>
        </div>
        {/* <!-- End Announcement Banner --> */}

        {/* <!-- Title --> */}
        <div class="mt-5 max-w-2xl text-center mx-auto">
          <h1 class="z-10 relative font-bold text-gray-800 text-4xl md:text-5xl lg:text-6xl dark:text-gray-200">
            Simplify your
            <span class="bg-clip-text bg-gradient-to-l from-blue-600 to-violet-600 text-transparent"> Links</span>
          </h1>
        </div>
        {/* <!-- End Title --> */}

        <div class="mt-5 max-w-3xl text-center mx-auto">
          <p class="text-lg text-gray-600 dark:text-gray-400">
            Effortless link management with a user-friendly dashboard and robust analytics.
          </p>
        </div>

        {/* <!-- Buttons --> */}
        <div class="flex flex-col sm:flex-row gap-3 justify-center items-center mt-8">
          <Link
            href={user.value ? '/dashboard' : '/login'}
            class="inline-flex justify-center items-center gap-x-3 text-center bg-gradient-to-tl from-blue-600 to-violet-600 hover:from-violet-600 hover:to-blue-600 border border-transparent text-white text-sm font-medium rounded-md focus:outline-none focus:ring-1 focus:ring-gray-600 py-3 px-4 dark:focus:ring-offset-gray-800 sm:w-auto w-2/3 h-10"
          >
            Get Started
            <svg class="flex-shrink-0 w-4 h-4" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M5.27921 2L10.9257 7.64645C11.1209 7.84171 11.1209 8.15829 10.9257 8.35355L5.27921 14"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
              />
            </svg>
          </Link>
          <a
            type="button"
            href="https://github.com/origranot/reduced.to#-docker"
            target="_blank"
            class="flex justify-center items-center gap-x-2 p-2 ps-3 text-sm font-mono rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600 sm:w-auto w-2/3 h-10"
          >
            Self-Hosted Deployment
            <IoLogoDocker class="h-5 w-5" />
          </a>
        </div>
        {/* <!-- End Buttons --> */}
        <div class="mt-5 flex justify-center items-center gap-x-1 sm:gap-x-3">
          <a
            class="inline-flex items-center gap-x-1.5 text-sm text-blue-600 decoration-2 hover:underline font-medium"
            href="https://docs.reduced.to"
            rel="canonical"
            target="_blank"
          >
            Official Documentation
            <svg class="flex-shrink-0 w-4 h-4" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M5.27921 2L10.9257 7.64645C11.1209 7.84171 11.1209 8.15829 10.9257 8.35355L5.27921 14"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
              />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
});
