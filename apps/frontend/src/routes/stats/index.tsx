import { component$, useStylesScoped$ } from '@builder.io/qwik';
import { formatDate } from '../../lib/date-utils';
import animations from '../../assets/css/animations.css?inline';

export default component$(() => {
  useStylesScoped$(animations);

  return (
    <section class="flex flex-col h-[calc(100vh-64px)]">
      <div class="relative before:absolute before:top-0 before:start-1/2 before:bg-[url('assets/svg/hero/polygon-bg-element-light.svg')] before:bg-no-repeat before:bg-top before:bg-cover before:w-full before:h-full before:-z-[1] before:transform before:-translate-x-1/2 dark:before:bg-[url('assets/svg/hero/polygon-bg-element-dark.svg')]">
        <div class="grow container flex flex-col items-center justify-center px-5 mx-auto my-8">
          <div class="max-w-md text-center mb-8">
            <h2 class="mb-8 font-extrabold text-6xl text-gray-600 dark:text-gray-300">In Summary:</h2>
            <ul class="flex list-disc list-inside">
              <li class="ml-0 text-green-500">
                <span class="text-black dark:text-white">1 URL</span>
              </li>
              <li class="ml-8 text-blue-500">
                <span class="text-black dark:text-white">0 Clicks</span>
              </li>
              <li class="ml-8 text-yellow-500">
                <span class="text-black dark:text-white">0 Locations</span>
              </li>
              <li class="ml-8 text-red-500">
                <span class="text-black dark:text-white">0 Devices</span>
              </li>
            </ul>
          </div>
        </div>
        <div class="w-full h-full flex justify-center">
          <div class="mt-7 bg-gray-100 border border-gray-200 rounded-xl shadow-sm dark:bg-gray-800 dark:border-gray-700">
            <div class="items-stretch flex gap-0 max-md:flex-wrap rounded-xl max-md:justify-center dark:bg-gray-900 dark:bg-opacity-90 dark:darken-[10]">
              <div class="items-stretch flex grow basis-[0%] flex-col">
                <div class="text-gray-400 text-3xl font-medium leading-8 whitespace-nowrap items-stretch shadow-sm justify-center p-7 max-md:px-5">
                  ID
                </div>
                {/*Mapping the array of events and displaying specifcally the IDS by order */}
              </div>
              <div class="items-stretch flex grow basis-[0%] flex-col">
                <div class="text-gray-400 text-3xl font-medium leading-8 whitespace-nowrap items-stretch shadow-sm justify-center p-7 max-md:px-5">
                  Browser / Device
                </div>
                {/*Mapping the array of events and displaying specifcally the browsers by order */}
              </div>
              <div class="items-stretch flex grow basis-[0%] flex-col">
                <div class="text-gray-400 text-3xl font-medium leading-8 whitespace-nowrap items-stretch shadow-sm justify-center p-7 max-md:px-5">
                  Location
                </div>
                {/*Mapping the array of events and displaying specifcally the Locations by order */}
              </div>
              <div class="items-stretch flex grow basis-[0%] flex-col">
                <div class="text-gray-400 text-3xl font-medium leading-8 whitespace-nowrap items-stretch shadow-sm justify-center p-7 max-md:px-5">
                  Timestamp
                </div>
                {/*Mapping the array of events and displaying specifcally the Timestamps by order */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});
