import { component$, useContext, useId, useSignal, useStylesScoped$, useTask$, useVisibleTask$ } from '@builder.io/qwik';
import { ToasterContext } from './toaster';
import { HiXMarkOutline } from '@qwikest/icons/heroicons';
import { flip } from './utils';
import styles from './toast.css?inline';

export type ToastType = 'error' | 'info';

export interface ToastParams {
  id: string;
  duration?: number;
  title?: string;
  description?: string;
  type?: ToastType;
  class?: string;
}

export const Toast = component$((props: ToastParams) => {
  useStylesScoped$(styles);

  const { toaster, toasts } = useContext(ToasterContext);
  const itemId = useId();
  const leaving = useSignal(false);
  const hovered = useSignal(false);
  const closeClicked = useSignal(false); // Signal to track close button click

  useVisibleTask$(({ track }) => {
    track(() => closeClicked.value);

    setTimeout(() => {
      closeClicked.value = true;
    }, props.duration);

    const remove = () => {
      flip(toaster.value);
      toasts.value = toasts.value.filter((t) => t.id !== props.id);
    };

    const leave = () => {
      leaving.value = true;
      setTimeout(remove, 300);
    };

    if (closeClicked.value) {
      return leave();
    }
  });

  const toastStyles = getToastStylesByType(props.type!);

  return (
    <li
      id={itemId}
      class={`${props.class && props.class} ${
        leaving.value ? 'animated-leave' : 'animated-enter'
      } relative flex w-full items-center justify-between space-x-2 border overflow-hidden p-4 rounded-md shadow-sm text-left ${toastStyles}`}
      onMouseEnter$={() => (hovered.value = true)}
      onMouseLeave$={() => (hovered.value = false)}
    >
      <div class="grid gap-1 mr-20">
        {props.title && <span class="text-sm font-semibold">{props.title}</span>}
        {props.description && <span class="text-sm opacity-90">{props.description}</span>}
      </div>
      {/* Close button */}
      <button
        type="button"
        class={`absolute right-1 top-1 rounded-md p-1 ${hovered.value ? 'opacity-100' : 'opacity-0'} transition-opacity`}
        onClick$={() => (closeClicked.value = true)}
      >
        <HiXMarkOutline class="h-4 w-4" />
      </button>
    </li>
  );
});

const getToastStylesByType = (type: ToastType) => {
  switch (type) {
    case 'error':
      return 'bg-error border-error';
    default:
      return 'bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700';
  }
};
