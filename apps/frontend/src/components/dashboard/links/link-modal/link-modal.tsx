import { component$, useSignal, $, Signal, useVisibleTask$ } from '@builder.io/qwik';
import { Form, globalAction$, zod$ } from '@builder.io/qwik-city';
import { z } from 'zod';
import { ACCESS_COOKIE_NAME } from '../../../../shared/auth.service';
import { normalizeUrl } from '../../../../utils';
import { tomorrow } from '../../../../lib/date-utils';
import { SocialMediaPreview } from './social-media-preview/social-media-preview';
import { UNKNOWN_FAVICON } from '../../../temporary-links/utils';

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
  const faviconUrl = useSignal<string | null>(null);
  const previewUrl = useSignal<string | null>(null);

  // Optional fields
  const isExpirationTimeOpen = useSignal(false);
  const isPasswordProtectionOpen = useSignal(false);

  const action = useCreateLink();

  useVisibleTask$(({ track }) => {
    const url = track(() => previewUrl.value);

    const debounceTimeout = setTimeout(() => {
      faviconUrl.value = url === '' || url === null ? null : `https://www.google.com/s2/favicons?sz=128&domain=${url}`;
    }, 500); // 500ms debounce time

    return () => {
      clearTimeout(debounceTimeout);
    };
  });

  const toggleOption = $(
    (
      signal: Signal<boolean>,
      resetKey: keyof CreateLinkInput,
      errorResetKey: keyof Partial<Record<keyof CreateLinkInput, string[]>>,
      resetValue: any = undefined
    ) => {
      signal.value = !signal.value;
      if (!signal.value && resetKey !== undefined) {
        // Reset field errors
        if (action.value?.fieldErrors![errorResetKey]) {
          action.value.fieldErrors[errorResetKey] = [];
        }

        // Reset form values
        inputValue.value[resetKey] = resetValue;
      }
    }
  );

  const clearValues = $(() => {
    inputValue.value = { ...initValues };

    isExpirationTimeOpen.value = false;
    isPasswordProtectionOpen.value = false;
    faviconUrl.value = null;
    previewUrl.value = null;

    if (action.value?.fieldErrors) {
      Object.keys(action.value.fieldErrors).forEach((key) => {
        action.value!.fieldErrors![key as keyof FieldErrors] = [];
      });
    }
  });

  return (
    <>
      <dialog
        id={LINK_MODAL_ID}
        class="fixed inset-0 z-40 m-auto max-h-fit w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-modal p-0 shadow-xl sm:rounded-2xl max-w-screen-lg"
      >
        <div class="grid grid-cols-1 md:grid-cols-2 max-h-[95vh] divide-x divide-gray-100 dark:divide-gray-700 overflow-auto md:overflow-hidden">
          <div class="rounded-l-2xl md:max-h-[95vh] flex flex-col">
            <div class="sticky top-0 z-10 flex h-14 items-center justify-center border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-modal px-5 sm:h-24">
              <img src={faviconUrl.value || UNKNOWN_FAVICON} alt="Favicon" class="mr-4 w-8 h-8" />
              <h2 class="text-lg font-medium">Create a new link</h2>
            </div>
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
              class="flex flex-col flex-grow"
            >
              <div class="px-4 p-5 flex-grow">
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
                    previewUrl.value = inputValue.value.url;
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
                <div class="divider pt-4">Optional</div>
                <div class="flex flex-col">
                  <div class="form-control">
                    <label class="cursor-pointer label">
                      <span class="label-text">Expiration date</span>
                      <input
                        type="checkbox"
                        checked={isExpirationTimeOpen.value}
                        onChange$={() => toggleOption(isExpirationTimeOpen, 'expirationTime', 'expirationTime', undefined)}
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
                        onChange$={() => toggleOption(isPasswordProtectionOpen, 'passwordProtection', 'passwordProtection', undefined)}
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
              </div>
              <button type="submit" class="btn btn-primary md:w-full w-1/2 mt-10 no-animation md:rounded-none m-auto mb-5 md:mb-0">
                {action.isRunning ? <span class="loading loading-spinner-small"></span> : 'Create'}
              </button>
            </Form>
          </div>
          <div class="rounded-r-2xl md:max-h-[95vh] flex flex-col">
            <div class="sticky top-0 z-10 flex !h-14 min-h-14 items-center justify-center border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-modal px-5 sm:h-24 sm:min-h-24">
              <h2 class="text-lg font-medium">Social Previews</h2>
            </div>
            <div class="items-center justify-center space-y-4 bg-gray-100 dark:bg-slate-900 p-5 overflow-auto">
              <SocialMediaPreview url={previewUrl} />
            </div>
          </div>
        </div>
        <button
          type="button"
          class="absolute right-0 top-0 z-20 m-3 rounded-full p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none active:bg-gray-200 dark:active:bg-gray-900 md:block"
          onClick$={() => {
            (document.getElementById(LINK_MODAL_ID) as any).close();
            clearValues();
          }}
        >
          <svg
            fill="none"
            shape-rendering="geometricPrecision"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            viewBox="0 0 24 24"
            width="14"
            height="14"
            class="h-5 w-5"
          >
            <path d="M18 6L6 18"></path>
            <path d="M6 6l12 12"></path>
          </svg>
        </button>
      </dialog>
    </>
  );
});
