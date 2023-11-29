import { component$, useContext, useId, useSignal, useStyles$, useTask$, useVisibleTask$ } from '@builder.io/qwik';
import styles from './toaster.css?inline';
import { ToasterContext } from './toaster';
import { HiCheckCircleOutline, HiExclamationCircleOutline, HiInformationCircleOutline, HiXMarkOutline } from '@qwikest/icons/heroicons';
import { flip } from './utils';

export type ToastType = 'error' | 'info' | 'success' | 'warning';

export interface ToastParams {
  id: string;
  duration?: number;
  title?: string;
  description?: string;
  type?: ToastType;
}

export const Toast = component$((props: ToastParams) => {
  useStyles$(styles);
  const { toaster, toasts } = useContext(ToasterContext);
  const itemId = useId();
  const leaving = useSignal(false);
  const hovered = useSignal(false);

  useVisibleTask$(({ track }) => {
    track(() => hovered.value);
    console.log(hovered.value);
  });

  useTask$(({ track }) => {
    track(() => props.duration);
    const remove = () => {
      flip(toaster.value);
      toasts.value = toasts.value.filter((t) => t.id !== props.id);
    };
    const leave = () => {
      leaving.value = true;
      setTimeout(remove, 300);
    };
    if (!props.duration) return leave();
    const timeout = setTimeout(leave, props.duration);
    return () => clearTimeout(timeout);
  });

  const toastStyles = getToastStylesByType(props.type!);

  return (
    <li
      id={itemId}
      class={`${
        leaving.value ? 'leave' : ''
      } relative flex w-full items-center justify-between space-x-2 border overflow-hidden p-4 rounded-md shadow-sm text-left ${toastStyles}`}
      onMouseEnter$={() => (hovered.value = true)}
      onMouseLeave$={() => (hovered.value = false)}
    >
      <div class="grid gap-1">
        <div class="text-sm font-semibold">{props.title}</div>
        {props.description && <div class="text-sm opacity-90">{props.description}</div>}
      </div>
      {/* Close button */}
      <button
        type="button"
        class={`absolute right-1 top-1 rounded-md p-1 ${hovered.value ? 'opacity-100' : 'opacity-0'} transition-opacity`}
        onClick$={() => {
          toasts.value = toasts.value.filter((t) => t.id !== props.id);
        }}
      >
        <HiXMarkOutline class="h-4 w-4" />
      </button>
    </li>
  );
});

const getToastStylesByType = (type: ToastType) => {
  switch (type) {
    case 'success':
      return 'bg-success';
    case 'warning':
      return 'bg-warning';
    case 'info':
      return 'bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700';
    case 'error':
      return 'bg-error';
    default:
      return 'bg-info';
  }
};
