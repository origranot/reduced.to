import { component$ } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';

export const Footer = component$(() => {
  return (
    <footer class="w-full mt-auto max-w-[85rem] py-10 px-4 sm:px-6 lg:px-8 mx-auto border-t-[2px] border-base-200">
      <div class="grid grid-cols-1 md:grid-cols-3 items-center gap-5 text-center">
        <div>
          <Link
            class="flex-none text-xl font-semibold text-black dark:text-white dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
            href="/"
            aria-label="Brand"
          >
            Reduced.to
          </Link>
        </div>

        <ul class="text-center">
          <li class="inline-block relative pe-8 last:pe-0 last-of-type:before:hidden before:absolute before:top-1/2 before:end-3 before:-translate-y-1/2 before:content-['/'] before:text-gray-300 dark:before:text-gray-600">
            <a
              class="inline-flex gap-x-2 text-sm text-gray-500 hover:text-gray-800 dark:text-gray-500 dark:hover:text-gray-200 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
              href="/privacy-policy"
              target="_blank"
            >
              Privacy Policy
            </a>
          </li>
          <li class="inline-block relative pe-8 last:pe-0 last-of-type:before:hidden before:absolute before:top-1/2 before:end-3 before:-translate-y-1/2 before:content-['/'] before:text-gray-300 dark:before:text-gray-600">
            <a
              class="inline-flex gap-x-2 text-sm text-gray-500 hover:text-gray-800 dark:text-gray-500 dark:hover:text-gray-200 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
              href="/terms"
              target="_blank"
            >
              Terms & Conditions
            </a>
          </li>
          <li class="inline-block relative pe-8 last:pe-0 last-of-type:before:hidden before:absolute before:top-1/2 before:end-3 before:-translate-y-1/2 before:content-['/'] before:text-gray-300 dark:before:text-gray-600">
            <a
              class="inline-flex gap-x-2 text-sm text-gray-500 hover:text-gray-800 dark:text-gray-500 dark:hover:text-gray-200 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
              href="/report"
            >
              Report a link
            </a>
          </li>
        </ul>

        <div class="md:text-end space-x-2">
          <a
            class="w-8 h-8 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-full border border-transparent text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
            href="https://reduced.to/git"
          >
            <svg
              class="flex-shrink-0 w-3.5 h-3.5"
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
            </svg>
          </a>
          <a
            class="w-8 h-8 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-full border border-transparent text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
            href="https://reduced.to/discord"
          >
            <svg
              class="flex-shrink-0 w-3.5 h-3.5"
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M20.317 4.369a19.791 19.791 0 00-4.885-1.515c-.209.374-.443.885-.608 1.292a17.36 17.36 0 00-5.45 0c-.174-.414-.426-.918-.635-1.292a19.916 19.916 0 00-4.886 1.515C1.988 9.15 1.254 13.81 1.566 18.431a19.825 19.825 0 005.999 2.939c.484-.674.918-1.389 1.297-2.139-.715-.2-1.403-.454-2.069-.762.173-.128.341-.268.504-.412a14.12 14.12 0 0010.365 0c.166.145.333.284.504.412-.667.31-1.356.563-2.071.762.38.75.814 1.466 1.297 2.14a19.812 19.812 0 005.998-2.94c.42-5.016-.73-9.633-3.674-14.062zM8.02 15.385c-1.18 0-2.149-1.085-2.149-2.42 0-1.334.957-2.426 2.149-2.426 1.196 0 2.157 1.095 2.149 2.426 0 1.335-.957 2.42-2.149 2.42zm7.96 0c-1.18 0-2.149-1.085-2.149-2.42 0-1.334.957-2.426 2.149-2.426 1.196 0 2.157 1.095 2.149 2.426 0 1.335-.957 2.42-2.149 2.42z" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
});
