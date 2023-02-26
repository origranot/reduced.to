import { component$, useStylesScoped$ } from '@builder.io/qwik';
import styles from './waves.css?inline';

export const Waves = component$(() => {
  useStylesScoped$(styles);

  return (
    <div class="waves-div">
      <svg
        class="waves"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 24 150 28"
        preserveAspectRatio="none"
        shape-rendering="auto"
      >
        <defs>
          <path
            id="gentle-wave"
            d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
          ></path>
        </defs>
        <g class="parallax">
          <use xlink:href="#gentle-wave" x="48" y="0" fill={`hsla(var(--w-bg) / 0.7)`} />
          <use xlink:href="#gentle-wave" x="48" y="3" fill={`hsla(var(--w-bg) / 0.5)`} />
          <use xlink:href="#gentle-wave" x="48" y="5" fill={`hsla(var(--w-bg) / 0.3)`} />
          <use xlink:href="#gentle-wave" x="48" y="7" fill={`hsla(var(--w-bg) / 1)`} />
        </g>
      </svg>
    </div>
  );
});
