import { component$ } from '@builder.io/qwik';
import './twitter-button.css';

export interface TwitterButtonProps {
  className?: string;
  buttonTitle?: string;
  handleClick$: () => void;
}

export const TwitterButton = component$((props: TwitterButtonProps) => {
  return (
    <button
      type="button"
      id="twitter-btn"
      title={props?.buttonTitle ? props.buttonTitle : 'Share on twitter'}
      class={props?.className ? props.className : 'btn'}
      onClick$={props.handleClick$}
    >
      {/* New logo for twitter */}
      <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 512 512"><path class="twitter-x" d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"/></svg>
    </button>
  );
});
