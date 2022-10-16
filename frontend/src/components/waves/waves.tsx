import { component$, useContext, useStylesScoped$ } from '@builder.io/qwik';
import { ThemeContext, ThemeStore } from '../../routes/layout';
import styles from './waves.css?inline';

export const Waves = component$(() => {
  useStylesScoped$(styles);
  const state: ThemeStore = useContext(ThemeContext) as ThemeStore;

  const fillColor = state.darkMode ? '255,255,255' : '5,122,255';

  return (
    <div className="waves-div">
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
          <use
            // @ts-expect-error
            xlink:href="#gentle-wave"
            x="48"
            y="0"
            fill={`rgba(${fillColor},0.7)`}
          />
          <use
            // @ts-expect-error
            xlink:href="#gentle-wave"
            x="48"
            y="3"
            fill={`rgba(${fillColor},0.5)`}
          />
          <use
            // @ts-expect-error
            xlink:href="#gentle-wave"
            x="48"
            y="5"
            fill={`rgba(${fillColor},0.3)`}
          />
          <use
            // @ts-expect-error
            xlink:href="#gentle-wave"
            x="48"
            y="7"
            fill={`rgba(${fillColor},1)`}
          />
        </g>
      </svg>
    </div>
  );
});
