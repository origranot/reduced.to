import { component$, useStylesScoped$ } from '@builder.io/qwik';
import styles from './loader.css?inline';

export interface LoaderProps {
  visible: boolean;
}

export const Loader = component$((props: LoaderProps) => {
  useStylesScoped$(styles);

  return (
    <div id="loading" className={`${props.visible ? '' : 'hidden'} fade-in`}>
      <span class="loader" />
    </div>
  );
});
