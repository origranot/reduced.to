import { component$, useSignal, $ } from '@builder.io/qwik';
import { HiXMarkOutline } from '@qwikest/icons/heroicons';
import { Form, globalAction$, zod$ } from '@builder.io/qwik-city';
import { z } from 'zod';
import { ACCESS_COOKIE_NAME } from '../../../../shared/auth.service';

export const LINK_MODAL_ID = 'link-modal';

const useCreateLink = globalAction$(
  async ({ url }, { fail, cookie }) => {
    const response: Response = await fetch(`${process.env.API_DOMAIN}/api/v1/shortener`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${cookie.get(ACCESS_COOKIE_NAME)?.value}`,
      },
      body: JSON.stringify({
        url,
        expirationTime: null, // forever
      }),
    });

    const data: { url: string; key: string; message?: string[]; statusCode?: number } = await response.json();

    if (response.status !== 201) {
      return fail(data?.statusCode || 500, {
        message: data?.message || 'There was an error creating your link. Please try again.',
      });
    }

    return {
      url,
      key: data.key,
    };
  },
  zod$({
    url: z
      .string({
        required_error: "The url field can't be empty.",
      })
      .min(1, {
        message: "The url field can't be empty.",
      })
      .url("The url you've entered is not valid..."),
  })
);

export interface LinkModalProps {
  onSubmitHandler: () => void;
}

export const LinkModal = component$(({ onSubmitHandler }: LinkModalProps) => {
  const inputValue = useSignal('');

  const action = useCreateLink();

  const clearValues = $(() => {
    inputValue.value = '';
  });

  return (
    <>
      <dialog id={LINK_MODAL_ID} class="modal">
        <Form
          action={action}
          onSubmitCompleted$={() => {
            if (action.status !== 200) {
              return;
            }

            clearValues();
            (document.getElementById(LINK_MODAL_ID) as any).close();
            onSubmitHandler();
          }}
          class="modal-box relative p-4 w-full max-w-md max-h-full"
        >
          <div class="flex items-center justify-between px-4">
            <h3 class="text-lg font-semibold">Create New Link</h3>
            <button
              type="button"
              class="btn btn-ghost btn-sm"
              onClick$={() => {
                (document.getElementById(LINK_MODAL_ID) as any).close();
                clearValues();
              }}
            >
              <HiXMarkOutline class="h-7 w-7" />
              <span class="sr-only">Close modal</span>
            </button>
          </div>
          <div class="px-4 md:p-5">
            <div class="pt-1">
              <div class="divider m-0"></div>
              <label class="label">
                <span class="label-text">Destination URL</span>
              </label>
              <input
                name="url"
                type="text"
                placeholder="This should be a very long url..."
                class="input input-bordered w-full"
                value={inputValue.value}
                onInput$={(ev: InputEvent) => {
                  inputValue.value = (ev.target as HTMLInputElement).value;
                }}
              />
              {action.value?.fieldErrors?.url && (
                <label class="label">
                  <span class={`label-text text-xs text-error text-left`}>{action.value.fieldErrors.url[0]}</span>
                </label>
              )}
              {action.value?.failed && action.value.message && (
                <label class="label">
                  <span class={`label-text text-xs text-error text-left`}>{action.value.message}</span>
                </label>
              )}
            </div>
            <div class="divider pt-4">Optional</div>

            <div class="flex flex-col">
              <div class="form-control w-full">
                <label class="cursor-pointer label">
                  <span class="label-text">Expiration date</span>
                  <span class="badge badge-primary">Soon</span>
                  <input type="checkbox" class="hidden toggle toggle-primary" disabled />
                </label>
              </div>
              <div class="form-control w-full">
                <label class="cursor-pointer label">
                  <span class="label-text">Password protection</span>
                  <span class="badge badge-primary">Soon</span>
                  <input type="checkbox" class="hidden toggle toggle-primary" disabled />
                </label>
              </div>
            </div>
            <button type="submit" class="btn btn-primary w-1/2 mt-10">
              {action.isRunning && <span class="loading loading-spinner-small"></span>} Create
            </button>
          </div>
        </Form>
        <form method="dialog" class="modal-backdrop">
          <button onClick$={clearValues}>close</button>
        </form>
      </dialog>
    </>
  );
});
