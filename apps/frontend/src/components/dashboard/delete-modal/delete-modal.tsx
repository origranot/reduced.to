import { component$, useSignal, $ } from '@builder.io/qwik';
import { HiXMarkOutline } from '@qwikest/icons/heroicons';
import { ActionStore, Form } from '@builder.io/qwik-city';
import { useToaster } from '../../toaster/toaster';

export interface DeleteModalProps {
  id: string;
  confirmation: string;
  type: string;
  action: ActionStore<any, any>;
  onSubmitHandler?: () => void;
}

export const DeleteModal = component$(({ id, type, confirmation, onSubmitHandler, action }: DeleteModalProps) => {
  const inputValue = useSignal('');
  const toaster = useToaster();

  const clearValues = $(() => {
    inputValue.value = '';
  });

  return (
    <>
      <dialog id={id} class="modal">
        <Form
          action={action}
          onSubmitCompleted$={() => {
            if (action.value?.fieldErrors && Object.keys(action.value?.fieldErrors).length > 0) {
              return;
            }

            if (action.value?.failed && action.value.message) {
              toaster.add({
                title: 'Error',
                description: `Something went wrong while deleting your ${type}. Please try again later.`,
                type: 'error',
              });
              return;
            }

            toaster.add({
              title: 'Success',
              description: `Your ${type} has been deleted successfully.`,
              type: 'info',
            });

            onSubmitHandler && onSubmitHandler();
          }}
          class="modal-box relative p-4 w-full max-w-md max-h-full"
        >
          <div class="flex items-center justify-between px-4">
            <h3 class="text-lg font-semibold">Are you sure?</h3>
            <button
              type="button"
              class="btn btn-ghost btn-sm"
              onClick$={() => {
                (document.getElementById(id) as any).close();
                clearValues();
              }}
            >
              <HiXMarkOutline class="h-7 w-7" />
              <span class="sr-only">Close</span>
            </button>
          </div>
          <div class="px-4 md:p-5">
            <div class="pt-1 text-left">
              <p class="dark:text-gray-300">
                You are about to delete your {type}. This action cannot be undone. This will permanently delete your {type} and all of its
                data associated with it.
              </p>
              <label class="label">
                <span class="label-text dark:text-gray-500">
                  Please type <span class="font-semibold dark:text-gray-300">{confirmation}</span> to confirm.
                </span>
              </label>
              <input
                id="confirmation"
                name="confirmation"
                type="text"
                class="input input-bordered w-full"
                value={inputValue.value}
                onInput$={(ev: InputEvent) => {
                  inputValue.value = (ev.target as HTMLInputElement).value;
                }}
              />
              {action.value?.fieldErrors?.confirmation && (
                <label class="label">
                  <span class={`label-text text-xs text-error text-left`}>{action.value.fieldErrors?.confirmation}</span>
                </label>
              )}
            </div>
            <button type="submit" class="btn btn-error w-full mt-5">
              {action.isRunning ? <span class="loading loading-spinner-small"></span> : <span>I understand, delete my {type}</span>}
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
