import { component$, useSignal, $ } from '@builder.io/qwik';
import { HiXMarkOutline } from '@qwikest/icons/heroicons';
import { ActionStore, Form } from '@builder.io/qwik-city';
import { useToaster } from '../../toaster/toaster';

export const DELETE_MODAL_ID = 'delete-modal';
export const DELETE_CONFIRMATION = 'DELETE';
export const CANCEL_CONFIRMATION = 'CANCEL';
export const RESUME_CONFIRMATION = 'RESUME';

export interface ModalProps {
  id: string;
  confirmation: string;
  idToDelete?: string;
  type: string;
  action: ActionStore<any, any>;
  operationType: 'delete' | 'cancel' | 'resume';
  onSubmitHandler?: () => void;
}

export const GenericModal = component$(({ id, type, confirmation, idToDelete, onSubmitHandler, action, operationType }: ModalProps) => {
  const inputValue = useSignal('');
  const toaster = useToaster();

  const clearValues = $(() => {
    inputValue.value = '';

    if (action.value?.fieldErrors) {
      action.value.fieldErrors = [];
    }
  });

  let successMessage: string;
  switch (operationType) {
    case 'delete':
      successMessage = `Your ${type} has been deleted successfully.`;
      break;
    case 'cancel':
      successMessage = `Your ${type} has been canceled successfully.`;
      break;
    case 'resume':
      successMessage = `Your ${type} has been resumed successfully.`;
      break;
  }

  const operationText = operationType === 'delete' ? 'delete' : operationType === 'cancel' ? 'cancel' : 'resume';
  const errorMessage = `Something went wrong while ${operationText}ing your ${type}. Please try again later.`;
  const confirmationMessage =
    operationType === 'delete'
      ? `This action cannot be undone. This will permanently delete your ${type}.`
      : operationType === 'cancel'
      ? `You will still be able to use your ${type} until the end of the current billing period.`
      : `This will revert your scheduled cancellation and your subscription will remain active.`;

  const buttonClass = operationType === 'delete' ? 'btn-error' : operationType === 'cancel' ? 'btn-error' : 'btn-warning';

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
                description: errorMessage,
                type: 'error',
              });
              return;
            }

            toaster.add({
              title: 'Success',
              description: successMessage,
              type: 'info',
            });

            (document.getElementById(id) as any).close();
            clearValues();
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
                You are about to {operationText} your {type}. {confirmationMessage}
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
              {idToDelete && (
                <input id="idToDelete" name="idToDelete" type="hidden" class="input input-bordered w-full" value={idToDelete} />
              )}
              {action.value?.fieldErrors?.confirmation && (
                <label class="label">
                  <span class={`label-text text-xs text-error text-left`}>{action.value.fieldErrors?.confirmation}</span>
                </label>
              )}
            </div>
            <button type="submit" class={`btn ${buttonClass} w-full mt-5 ${action.isRunning ? 'btn-disabled' : ''}`}>
              {action.isRunning ? (
                <span class="loading loading-spinner-small"></span>
              ) : (
                <span>
                  I understand, {operationText} my {type}
                </span>
              )}
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
