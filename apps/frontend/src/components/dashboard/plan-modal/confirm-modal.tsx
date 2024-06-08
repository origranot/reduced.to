import { component$ } from '@builder.io/qwik';
import { useToaster } from '../../toaster/toaster';
import { ActionStore, Form } from '@builder.io/qwik-city';
import { useRevalidatePlan } from '../../../routes/dashboard/settings/billing/use-revalidate-plan';

export const CONFIRM_MODAL_ID = 'confirm-modal';

interface ConfirmModalProps {
  id: string;
  planId?: string | null;
  priceId?: string | null;
  operation?: 'upgrade' | 'downgrade';
  action: ActionStore<any, any>;
}

export const ConfirmModal = component$(({ id, planId, priceId, operation = 'upgrade', action }: ConfirmModalProps) => {
  const toaster = useToaster();
  const revalidatePlan = useRevalidatePlan();

  const getModalContent = () => {
    switch (operation) {
      case 'downgrade':
        return {
          title: 'Downgrade your subscription?',
          description: 'You will be charged the prorated amount immediately, and your subscription will be downgraded.',
          successTitle: 'Subscription downgraded',
          successDescription: 'You have successfully downgraded your subscription',
          errorTitle: 'Could not downgrade your subscription',
        };
      case 'upgrade':
        return {
          title: 'Upgrade your subscription?',
          description: 'You will be charged the prorated amount immediately, and your subscription will be upgraded.',
          successTitle: 'Subscription upgraded',
          successDescription: 'You have successfully upgraded your subscription',
          errorTitle: 'Could not upgrade your subscription',
        };
    }
  };

  const { title, description, successTitle, successDescription, errorTitle } = getModalContent();

  return (
    <dialog id={id} class="modal">
      <Form
        action={action}
        onSubmitCompleted$={() => {
          if (action.status !== 200) {
            toaster.add({
              title: errorTitle,
              description: action.value?.error || 'Try again later',
              type: 'error',
            });
          } else {
            toaster.add({
              title: successTitle,
              description: successDescription,
              type: 'info',
            });
          }
          (document.getElementById(id) as any).close();
          revalidatePlan.submit();
        }}
        class="modal-box relative w-full max-w-sm max-h-full"
      >
        <input type="hidden" name="planId" value={planId} />
        <input type="hidden" name="itemId" value={priceId} />
        <input type="hidden" name="operationType" value={operation} />
        <div class="card card-body !pt-2">
          <h3 class="text-lg font-semibold">{title}</h3>
          <span class="text-center text-sm font-light">{description}</span>
        </div>
        <button type="submit" class={`btn btn-primary btn-block ${action.isRunning ? 'btn-disabled' : ''}`}>
          {action.isRunning && <span class="loading loading-spinner" />}
          Confirm
        </button>
      </Form>
      <form method="dialog" class="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
});
