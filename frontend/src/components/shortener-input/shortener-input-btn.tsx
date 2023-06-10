import { component$, useStylesScoped$ } from '@builder.io/qwik';
import styles from './shortener-input-btn.css?inline';

export interface ShortenerInputBtnProps {
  disabled: boolean;
  onClick$: () => void;
}

export const ShortenerInputBtn = component$((props: ShortenerInputBtnProps) => {
  useStylesScoped$(styles);

  return (
    <button
      disabled={props.disabled}
      onClick$={props.onClick$}
      type="button"
      id="shortenerBtn"
      class={`btn btn-primary w-full md:w-auto self-end mb-2`}
    >
      Shorten URL
    </button>
  );
});
