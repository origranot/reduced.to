import {
  $,
  component$,
  createContextId,
  useContext,
  useContextProvider,
  useId,
  useSignal,
  useStyles$,
  useTask$,
  useVisibleTask$,
} from '@builder.io/qwik';
import type { Signal } from '@builder.io/qwik';
import { Toast, ToastParams } from './toast';
import { flip } from './utils';

type Position = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
type ToasterProps = Omit<ToastParams, 'id'>;

export const ToasterContext = createContextId<{
  toaster: Signal<HTMLElement>;
  toasts: Signal<ToastParams[]>;
}>('ToasterContext');

export const useToasterProvider = () => {
  const toaster = useSignal<HTMLElement>();
  const toasts = useSignal<ToastParams[]>([]);
  useContextProvider(ToasterContext, { toaster, toasts });
};

export const useToaster = () => {
  const { toaster, toasts } = useContext(ToasterContext);
  return {
    add: $((params: ToasterProps) => {
      params.duration ||= 300000;
      params.type ||= 'info';

      flip(toaster.value);

      toasts.value = toasts.value.concat({
        id: crypto.randomUUID(),
        ...params,
      });
    }),
    remove: $((id: string) => {
      const index = toasts.value.findIndex((t) => t.id === id);
      toasts.value[index].duration = 0;
      toasts.value = [...toasts.value];
    }),
  };
};

export const Toaster = component$((props: { position: Position }) => {
  const { toaster, toasts } = useContext(ToasterContext);
  const getPositionClass = (position: Position) => {
    switch (position) {
      case 'top-left':
        return 'top-0 left-0';
      case 'top-right':
        return 'top-0 right-0';
      case 'bottom-left':
        return 'bottom-0 left-0';
      default:
        return 'bottom-0 right-0';
    }
  };

  const positionClass = getPositionClass(props.position);

  return (
    <ul
      ref={toaster}
      class={`${positionClass} gap-1 fixed z-50 flex flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]`}
    >
      {toasts.value.map((toastProps) => (
        <Toast key={toastProps.id} {...toastProps} />
      ))}
    </ul>
  );
});
