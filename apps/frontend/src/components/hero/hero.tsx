import { component$ } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';
import { IoLogoDocker } from '@qwikest/icons/ionicons';
import { useGetCurrentUser } from '../../routes/layout';

export const Hero = component$(() => {
  const user = useGetCurrentUser();

  return (
    <div class="relative before:absolute before:top-0 before:start-1/2 before:bg-[url('assets/svg/hero/polygon-bg-element-light.svg')] before:bg-no-repeat before:bg-top before:bg-cover before:w-full before:h-full before:-z-[1] before:transform before:-translate-x-1/2 dark:before:bg-[url('assets/svg/hero/polygon-bg-element-dark.svg')]">
      <div class="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-10">
        {/* <!-- Announcement Banner --> */}
        <div class="flex justify-center">
          <a
            class="inline-flex items-center gap-x-2 bg-white border border-gray-200 text-sm text-gray-800 p-1 ps-3 rounded-full hover:border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:hover:border-gray-600 dark:text-gray-200 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
            href="https://github.com/origranot/reduced.to"
            target="_blank"
          >
            Star us on GitHub!
            <span class="py-1.5 px-2.5 inline-flex justify-center items-center gap-x-2 rounded-full bg-gray-200 font-semibold text-sm text-gray-600 dark:bg-gray-700 dark:text-gray-400">
              🌟
            </span>
          </a>
        </div>
        {/* <!-- End Announcement Banner --> */}

        {/* <!-- Title --> */}
        <div class="mt-5 max-w-2xl text-center mx-auto">
          <h1 class="block font-bold text-gray-800 text-4xl md:text-5xl lg:text-6xl dark:text-gray-200">
            Simplify your
            <span class="bg-clip-text bg-gradient-to-tl from-blue-600 to-violet-600 text-transparent"> Links</span>
          </h1>
        </div>
        {/* <!-- End Title --> */}

        <div class="mt-5 max-w-3xl text-center mx-auto">
          <p class="text-lg text-gray-600 dark:text-gray-400">
            Your go-to URL shortener, provides a streamlined approach to link sharing. We empower you to manage your links effortlessly.
            Explore our user-friendly dashboard and robust analytics to enhance your link management experience.
          </p>
        </div>

        {/* <!-- Buttons --> */}
        <div class="mt-8 gap-3 flex justify-center">
          <Link
            href={user.value ? '/dashboard' : '/login'}
            class="inline-flex justify-center items-center gap-x-3 text-center bg-gradient-to-tl from-blue-600 to-violet-600 hover:from-violet-600 hover:to-blue-600 border border-transparent text-white text-sm font-medium rounded-md focus:outline-none focus:ring-1 focus:ring-gray-600 py-3 px-4 dark:focus:ring-offset-gray-800"
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
            class="relative group p-2 ps-3 inline-flex items-center gap-x-2 text-sm font-mono rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
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
