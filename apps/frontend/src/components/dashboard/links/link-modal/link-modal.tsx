import { component$, useSignal, $, Signal } from '@builder.io/qwik';
import { HiXMarkOutline } from '@qwikest/icons/heroicons';
import { Form, globalAction$, zod$ } from '@builder.io/qwik-city';
import { z } from 'zod';
import { ACCESS_COOKIE_NAME } from '../../../../shared/auth.service';
import { normalizeUrl } from '../../../../utils';
import { tomorrow } from '../../../../lib/date-utils';

export const LINK_MODAL_ID = 'link-modal';

interface CreateLinkInput {
  url: string;
  expirationTime?: string | number;
  passwordProtection?: string;
}

const CreateLinkInputSchema = z
  .object({
    url: z
      .string({
        required_error: "The url field can't be empty.",
      })
      .min(1, {
        message: "The url field can't be empty.",
      })
      .regex(/^(?:https?:\/\/)?(?:[\w-]+\.)+[a-z]{2,}(?::\d{1,5})?(?:\/\S*)?$/, {
        message: "The url you've entered is not valid",
      }),
    expirationTime: z.string().optional(),
    expirationTimeToggle: z.string().optional(),
    passwordProtection: z
      .string()
      .min(6, {
        message: 'Password must be at least 6 characters long.',
      })
      .max(25, {
        message: 'Password must be at most 25 characters long.',
      })
      .optional(),
    passwordProtectionToggle: z.string().optional(),
  })
  .refine((data) => !(data.expirationTimeToggle && !data.expirationTime), {
    message: 'Please select a date for your link to expire.',
    path: ['expirationTime'],
  })
  .refine((data) => !(data.passwordProtectionToggle && !data.passwordProtection), {
    message: 'Please enter a password for your link.',
    path: ['passwordProtection'],
  });

type FieldErrors = Partial<Record<keyof CreateLinkInput, string[]>>;

const useCreateLink = globalAction$(
  async ({ url, expirationTime, expirationTimeToggle, passwordProtection, passwordProtectionToggle }, { fail, cookie }) => {
    const fieldErrors: FieldErrors = {};

    if (expirationTimeToggle && !expirationTime) {
      fieldErrors.expirationTime = ['Please select a date for your link to expire.'];
    }

    if (passwordProtectionToggle && !passwordProtection) {
      fieldErrors.passwordProtection = ['Please enter a password for your link.'];
    }

    if (Object.keys(fieldErrors).length > 0) {
      return fail(400, { fieldErrors });
    }

    const body: CreateLinkInput = {
      url: normalizeUrl(url),
      ...(expirationTime && { expirationTime: new Date(expirationTime).getTime() }),
      ...(passwordProtection && { password: passwordProtection }),
    };

    const response: Response = await fetch(`${process.env.API_DOMAIN}/api/v1/shortener`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${cookie.get(ACCESS_COOKIE_NAME)?.value}`,
      },
      body: JSON.stringify(body),
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
  zod$(CreateLinkInputSchema)
);

export interface LinkModalProps {
  onSubmitHandler: () => void;
}

const initValues = {
  url: '',
  expirationTime: undefined,
  expirationTimeToggle: undefined,
  passwordProtection: undefined,
  passwordProtectionToggle: undefined,
};
export const LinkModal = component$(({ onSubmitHandler }: LinkModalProps) => {
  const inputValue = useSignal<CreateLinkInput>({ ...initValues });

  // Optional fields
  const isExpirationTimeOpen = useSignal(false);
  const isPasswordProtectionOpen = useSignal(false);

  const action = useCreateLink();

  const toggleDrawer = $(
    (
      signal: Signal<boolean>,
      resetKey: keyof CreateLinkInput,
      errorResetKey: keyof Partial<Record<keyof CreateLinkInput, string[]>>,
      resetValue: any = undefined
    ) => {
      signal.value = !signal.value;
      if (!signal.value && resetKey !== undefined) {
        // Reset field errors
        action.value!.fieldErrors![errorResetKey] = [];

        // Reset form values
        inputValue.value[resetKey] = resetValue;
      }
    }
  );

  const clearValues = $(() => {
    inputValue.value = { ...initValues };

    isExpirationTimeOpen.value = false;
    isPasswordProtectionOpen.value = false;

    if (action.value?.fieldErrors) {
      Object.keys(action.value.fieldErrors).forEach((key) => {
        action.value!.fieldErrors![key as keyof FieldErrors] = [];
      });
    }
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
                value={inputValue.value.url}
                onInput$={(ev: InputEvent) => {
                  inputValue.value.url = (ev.target as HTMLInputElement).value;
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
              <div class="form-control">
                <label class="cursor-pointer label">
                  <span class="label-text">Expiration date</span>
                  <input
                    type="checkbox"
                    checked={isExpirationTimeOpen.value}
                    onChange$={() => toggleDrawer(isExpirationTimeOpen, 'expirationTime', 'expirationTime', undefined)}
                    name="expirationTimeToggle"
                    class="toggle toggle-primary"
                  />
                </label>
                {isExpirationTimeOpen.value && (
                  <input
                    name="expirationTime"
                    type="date"
                    min={tomorrow().toISOString().split('T')[0]}
                    class="input input-bordered w-full"
                    value={inputValue.value.expirationTime}
                    onInput$={(ev: InputEvent) => {
                      inputValue.value.expirationTime = (ev.target as HTMLInputElement).value;
                    }}
                  />
                )}
                {action.value?.fieldErrors?.expirationTime && (
                  <label class="label">
                    <span class={`label-text text-xs text-error text-left`}>{action.value.fieldErrors.expirationTime[0]}</span>
                  </label>
                )}
              </div>
              <div class="form-control">
                <label class="cursor-pointer label">
                  <span class="label-text">Password protection</span>
                  <input
                    type="checkbox"
                    checked={isPasswordProtectionOpen.value}
                    onChange$={() => toggleDrawer(isPasswordProtectionOpen, 'passwordProtection', 'passwordProtection', undefined)}
                    name="passwordProtectionToggle"
                    class="toggle toggle-primary"
                  />
                </label>
                {isPasswordProtectionOpen.value && (
                  <input
                    name="passwordProtection"
                    type="password"
                    class="input input-bordered w-full"
                    value={inputValue.value.passwordProtection}
                    onInput$={(ev: InputEvent) => {
                      inputValue.value.passwordProtection = (ev.target as HTMLInputElement).value;
                    }}
                  />
                )}
                {action.value?.fieldErrors?.passwordProtection && (
                  <label class="label">
                    <span class={`label-text text-xs text-error text-left`}>{action.value.fieldErrors.passwordProtection[0]}</span>
                  </label>
                )}
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
