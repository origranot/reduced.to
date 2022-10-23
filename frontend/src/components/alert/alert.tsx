import { component$, useContext, useStore, useStylesScoped$, useWatch$ } from '@builder.io/qwik';
import styles from '~/assets/css/animations.css?inline';
import { InputContext, Store } from '~/routes';

export interface AlertStore {
  fadeIn: string;
  fadeOut: string;
  hidden: string;
}

export const ShortenerAlert = component$(() => {
  useStylesScoped$(styles);

  const alertStore: AlertStore = useStore<AlertStore>({
    fadeIn: '',
    fadeOut: '',
    hidden: 'hidden',
  });

  const state: Store = useContext(InputContext) as Store;

  useWatch$(({ track }) => {
    const showAlert = track(() => state.showAlert);

    if (showAlert) {
      alertStore.hidden = '';
      alertStore.fadeIn = 'fade-in';
    }

    const timer = setTimeout(() => {
      state.showAlert = false;
      alertStore.fadeIn = '';
      alertStore.fadeOut = 'fade-out';

      setTimeout(() => {
        alertStore.hidden = 'hidden';
        alertStore.fadeOut = '';
      }, 500);
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  });

  return (
    <>
      <div
        id="urlAlert"
        className={`alert alert-success shadow-lg ${alertStore.fadeIn} ${alertStore.fadeOut} ${alertStore.hidden}`}
      >
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current flex-shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>Link has been copied to the clipboard</span>
        </div>
      </div>
    </>
  );
});
