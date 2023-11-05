import Notify from '../../assets/svg/notify.svg?jsx';
import { component$ } from '@builder.io/qwik';
import { DocumentHead } from '@builder.io/qwik-city';

export default component$(() => {
  return (
    <div class="h-[calc(100vh-64px)]">
      <section class="max-w-xl px-4 sm:py-20 py-5 mx-auto space-y-1">
        <Notify class="h-[400px] sm:block hidden w-1/2 mx-auto mt-[-230px]" />
        <div class="text-left">
          <h2 class="text-lg font-medium">Report abuse</h2>
          <p class="text-gray-600 dark:text-gray-300">
            If you believe a link violates our terms of service, please report it below. We will review the link and take appropriate
            action. Thank you for helping us keep Reduced.to safe.
          </p>
          <div class="divider"></div>
          <div class="form-control">
            <label class="input-group">
              <input type="text" placeholder="reduced.to/example" class="input input-bordered sm:w-2/5 w-full" />
              <button class="btn join-item btn-warning !cursor-not-allowed">Report</button>
            </label>
          </div>
        </div>
      </section>
    </div>
  );
});

export const head: DocumentHead = {
  title: 'Reduced.to | Report Link',
  meta: [
    {
      name: 'title',
      content: 'Reduced.to | Report Link',
    },
    {
      name: 'description',
      content: 'Reduced.to | Report a link that violates our terms of service.',
    },
    {
      property: 'og:type',
      content: 'website',
    },
    {
      property: 'og:url',
      content: 'https://reduced.to/register',
    },
    {
      property: 'og:title',
      content: 'Reduced.to | Report Link',
    },
    {
      property: 'og:description',
      content: 'Reduced.to | Report a link that violates our terms of service.',
    },
    {
      property: 'twitter:card',
      content: 'summary',
    },
    {
      property: 'twitter:title',
      content: 'Reduced.to | Report Link',
    },
    {
      property: 'twitter:description',
      content: 'Reduced.to | Report a link that violates our terms of service.',
    },
  ],
};
