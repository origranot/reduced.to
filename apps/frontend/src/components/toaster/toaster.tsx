import { $, component$, createContextId, useContext, useContextProvider, useSignal } from '@builder.io/qwik';
import type { Signal } from '@builder.io/qwik';
import { Toast, ToastParams } from './toast';
import { flip } from './utils';

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
      params.duration ||= 3000;
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

export const Toaster = component$(() => {
  const { toaster, toasts } = useContext(ToasterContext);

  return (
    <ul
      ref={toaster}
      class={`gap-1 fixed z-50 flex flex-col-reverse p-4 w-full sm:top-auto top-0 sm:bottom-0 sm:right-0 sm:flex-col sm:max-w-[420px]`}
    >
      {toasts.value.map((toastProps) => (
        <Toast key={toastProps.id} {...toastProps} />
      ))}
    </ul>
  );
});
