import { component$, useStore } from '@builder.io/qwik';
import { DocumentHead, Form, globalAction$ } from '@builder.io/qwik-city';

// Global action to handle profile updates
export const updateProfile = globalAction$(async ({ displayName, profilePicture }, { fail, cookie }) => {});

export default component$(() => {
  const action = updateProfile();
  const user = useStore({
    displayName: '', // default value, should be fetched from user data
    profilePicture: '', // default value, should be fetched from user data
  });

  return (
    <div class="shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-xl w-full p-5">
      <Form>
        <div class="grid sm:grid-cols-12 gap-2 sm:gap-6">
          <div class="sm:col-span-3">
            <label class="inline-block text-gray-800 mt-2.5 dark:text-gray-200">Profile photo</label>
          </div>

          <div class="sm:col-span-9">
            <div class="flex items-center gap-5">
              <img
                class="inline-block h-16 w-16 rounded-full ring-2 ring-white dark:ring-gray-800"
                src="../assets/img/160x160/img1.jpg"
                alt="Image Description"
              />
              <div class="flex gap-x-2">
                <div>
                  <button
                    type="button"
                    class="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                  >
                    <svg
                      class="flex-shrink-0 w-4 h-4"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" x2="12" y1="3" y2="15" />
                    </svg>
                    Upload photo
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="sm:col-span-3">
            <label for="fullName" class="inline-block text-gray-800 mt-2.5 dark:text-gray-200">
              Full name
            </label>
          </div>

          <div class="sm:col-span-4 gap-5">
            <input id="fullName" type="text" class="py-2 px-3 block w-full input input-bordered" placeholder="Maria" />
          </div>

        </div>
        <div class="mt-5 flex justify-end gap-x-2">
          <button
            type="button"
            class="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
          >
            Cancel
          </button>
          <button
            type="button"
            class="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
          >
            Save changes
          </button>
        </div>
      </Form>
    </div>
  );
});

export const head: DocumentHead = {
  title: 'Reduced.to | Dashboard - Settings',
  meta: [
    {
      name: 'title',
      content: 'Reduced.to | Dashboard - My Settings',
    },
    {
      name: 'description',
      content: 'Reduced.to | Your settings page. update your profile, and more!',
    },
    {
      property: 'og:type',
      content: 'website',
    },
    {
      property: 'og:url',
      content: 'https://reduced.to/dashboard/settings',
    },
    {
      property: 'og:title',
      content: 'Reduced.to | Dashboard - My Settings',
    },
    {
      property: 'og:description',
      content: 'Reduced.to | Your settings page. update your profile, and more!',
    },
    {
      property: 'twitter:card',
      content: 'summary',
    },
    {
      property: 'twitter:title',
      content: 'Reduced.to | Dashboard - My Settings',
    },
    {
      property: 'twitter:description',
      content: 'Reduced.to | Your settings page. update your profile, and more!',
    },
  ],
};
