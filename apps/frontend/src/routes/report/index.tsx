import Notify from '../../assets/svg/notify.svg?jsx';
import { component$ } from '@builder.io/qwik';
import { DocumentHead, Form, globalAction$, z, zod$ } from '@builder.io/qwik-city';

export const useReport = globalAction$(
  async ({ link }, { fail }) => {
    const data: Response = await fetch(`${process.env.API_DOMAIN}/api/v1/reports`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(link),
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
      .url({
        message: 'Please enter a valid URL',
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
          <Form class="form-control">
            <label class="join input-group">
              <input
                name="link"
                type="text"
                placeholder="reduced.to/example"
                class="input input-bordered join-item focus:outline-0 sm:w-2/5 w-full"
              />
              <button class="btn join-item btn-warning !cursor-not-allowed">
                {action.isRunning ? <span class="loading loading-spinner-small"></span> : 'Report'}
              </button>
            </label>
          </Form>
          {action.value?.message && <span class="text-error text-left">{action.value.message}</span>}
          {action.value?.fieldErrors?.link && <span class="label-text text-error text-left">{action.value.fieldErrors.link}</span>}{' '}
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
