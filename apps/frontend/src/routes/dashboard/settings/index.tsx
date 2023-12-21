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
    <div class="shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-xl w-full p-5 text-left">
      <Form>
        <div class="grid grid-cols-3 gap-4">
          <div>
            <div class="font-bold">Personal Information</div>
            <span class="text-sm text-gray-500">Update your personal information</span>
          </div>
          <div class="col-span-2">
            <div class="flex gap-8 items-center">
              <div class="avatar">
                <div class="w-24 rounded">
                  <img width="844" height="844" src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
                </div>
              </div>
              <div class="flex flex-col gap-2">
                <button class="btn btn-sm btn-natural">Change avatar</button>
                <span class="text-sm text-gray-500">JPG, JPEG or PNG. 1MB max.</span>
              </div>
            </div>
            <div class="pt-5">
              <label for="name" class="block text-sm mb-2 dark:text-white text-left">
                Display name
              </label>
              <input type="name" id="name" name="name" class="py-3 px-4 w-full max-w-xs input input-bordered" required />
            </div>
            <div class="pt-5">
              <label for="email" class="block text-sm mb-2 dark:text-white text-left">
                Email address
              </label>
              <div class="flex gap-4 items-center">
                <input
                  type="email"
                  value={'email@gmail.com'}
                  id="email"
                  name="email"
                  class="py-3 px-4 w-full max-w-xs input input-bordered"
                  disabled
                />
                <label class="text-sm text-gray-500">Email is verified</label>
                {/* <button class="btn btn-warning">Verify now</button> */}
              </div>
              <div class="pt-5">
                <button type="submit" class="btn btn-sm btn-primary">
                  {action.isRunning ? <span class="loading loading-spinner-small"></span> : 'Save'}
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="divider py-3"></div>
        <div class="grid grid-cols-3 gap-4">
          <div>
            <div class="font-bold">Delete account</div>
            <span class="text-sm text-gray-500">
              This action is not reversible, all information related to this account will be deleted permanently.
            </span>
          </div>
          <div class="col-span-2">
            <button class="btn btn-sm btn-error dark:text-gray-200">Delete account</button>
          </div>
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
