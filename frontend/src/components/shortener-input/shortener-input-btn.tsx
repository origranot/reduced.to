import { component$, useStylesScoped$ } from '@builder.io/qwik';
import styles from './shortener-input-btn.css?inline';

export interface ShortenerInputBtnProps {
  ref: any;
  disabled: boolean;
  onClick$: () => void;
}

export const ShortenerInputBtn = component$((props: ShortenerInputBtnProps) => {
  useStylesScoped$(styles);

  return (
    <button
      ref={props.ref}
      onClick$={props.onClick$}
      type="button"
      id="shortenerBtn"
      class={`btn w-full sm:w-auto ${props.disabled ? 'btn-disabled' : ''}`}
    >
      Shorten URL
    </button>
  );
});
