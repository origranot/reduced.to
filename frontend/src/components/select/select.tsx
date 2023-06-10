import { Signal, Slot, component$, useSignal } from '@builder.io/qwik';
import './select.css';

type SelectProps = {
  disabled: boolean;
  selectInputValue: Signal<string | number>;
};

export const Select = component$(({ disabled, selectInputValue }: SelectProps) => {
  const isMenuOpen = useSignal(false);

  return (
    <div class=" min-w-[120px]">
      <button
        type="button"
        disabled={disabled}
        tabIndex={0}
        class="select-btn w-full md:border-l-0 md:rounded-none hover:text-inherit"
        onClick$={() => {
          if (disabled) {
            return;
          }
          isMenuOpen.value = !isMenuOpen.value;
        }}
        onFocusout$={() => {
          setTimeout(() => {
            isMenuOpen.value = false;
          }, 200);
        }}
      >
        {selectInputValue.value}
        <svg
          fill={`${'hsl(var(--bc) )'}`}
          height="15px"
          width="15px"
          version="1.1"
          id="Layer_1"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          viewBox="-105.6 -105.6 541.20 541.20"
          xml:space="preserve"
          transform={`rotate(${isMenuOpen.value ? '180' : '0'})`}
          stroke={'hsl(var(--n))'}
          stroke-width="16.169999999999998"
        >
          <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
          <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
          <g id="SVGRepo_iconCarrier">
            {' '}
            <path
              id="XMLID_225_"
              d="M325.607,79.393c-5.857-5.857-15.355-5.858-21.213,0.001l-139.39,139.393L25.607,79.393 c-5.857-5.857-15.355-5.858-21.213,0.001c-5.858,5.858-5.858,15.355,0,21.213l150.004,150c2.813,2.813,6.628,4.393,10.606,4.393 s7.794-1.581,10.606-4.394l149.996-150C331.465,94.749,331.465,85.251,325.607,79.393z"
            ></path>{' '}
          </g>
        </svg>
      </button>
      <div class="relative">
        <ul
          class={`menu p-2 w-full shadow rounded-box absolute min-w-[120px] text-left hidden bg-base-100 ${
            isMenuOpen.value ? 'select-btn-block animate-fade' : ''
          }
         z-[100]`}
        >
          <Slot />
        </ul>
      </div>
    </div>
  );
});
