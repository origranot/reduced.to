import Notify from '../../assets/svg/notify.svg?jsx';
import { component$ } from '@builder.io/qwik';
import { DocumentHead, Form, globalAction$, z, zod$ } from '@builder.io/qwik-city';
import { isValidURL, normalizeUrl } from '../../utils';

const VALID_CATEGORIES = ['Phishing', 'Malware', 'Child abuse', 'Violence', 'Spam', 'Illegal content', 'Other'];

export const useReport = globalAction$(
  async ({ link, category }, { fail }) => {
    const data: Response = await fetch(`${process.env.API_DOMAIN}/api/v1/reports`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        link,
        category,
      }),
    });

    const { message } = await data.json();

    const errorMessage = message ? message[0] : 'Something went wrong. Please try again later.';

    if (!data.ok) {
      return fail(400, {
        message: errorMessage,
      });
    }

    return {
      message: 'Your report has been submitted. Thank you for helping us keep Reduced.to safe.',
    };
  },
  zod$({
    link: z
      .string({
        required_error: 'This field is required',
      })
      .transform((url) => normalizeUrl(url))
      .refine((url) => isValidURL(url), {
        message: 'Please enter a valid URL',
      }),
    category: z
      .string({
        required_error: 'Category is required',
      })
      .refine((name) => VALID_CATEGORIES.includes(name), {
        message: 'Please select a valid category',
      }),
  })
);

export default component$(() => {
  const action = useReport();

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
          <Form action={action} class="form-control">
            <label class="join input-group sm:inline-flex block w-full">
              <div class="form-control w-full">
                <input
                  name="link"
                  type="text"
                  placeholder="reduced.to/example"
                  class="input input-bordered join-item focus:outline-0 w-full sm:!rounded-e-none !rounded-e-lg"
                />
                <label class="label">
                  <span class="label-text-alt text-error">{action.value?.fieldErrors?.link && action.value.fieldErrors.link}</span>
                </label>
              </div>
              <div class="form-control w-1/2 mt-3 sm:mt-0">
                <select
                  name="category"
                  class="select join-item select-bordered focus:outline-0 sm:inline-flex block sm:!rounded-none !rounded-lg"
                >
                  <option disabled selected>
                    Select a reason
                  </option>
                  {VALID_CATEGORIES.map((category, index) => (
                    <option key={index}>{category}</option>
                  ))}
                </select>
                <label class="label">
                  <span class="label-text-alt text-error">{action.value?.fieldErrors?.category && action.value.fieldErrors.category}</span>
                </label>
              </div>
              <button class="btn join-item btn-warning sm:inline-flex block sm:!rounded-e-lg sm:!rounded-l-none !rounded-lg mt-3 sm:mt-0 min-w-[80px]">
                {action.isRunning ? <span class="loading loading-spinner-small"></span> : 'Report'}
              </button>
            </label>
          </Form>
          {action.value?.message && <span class="text-error text-left">{action.value.message}</span>}
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
