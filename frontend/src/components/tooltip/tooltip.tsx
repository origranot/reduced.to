import { component$, Signal, useStore, useStylesScoped$, useTask$ } from '@builder.io/qwik';
import styles from './tooltip.css?inline';

export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

export interface TooltipPositionElements {
  container: string;
  span: string;
}

export interface TooltipPositionClass {
  top: TooltipPositionElements;
  bottom: TooltipPositionElements;
  left: TooltipPositionElements;
  right: TooltipPositionElements;
}

export interface TooltipProps {
  label: string;
  open: Signal<boolean>;
  position: TooltipPosition;
}

export const tooltipPosition = {
  top: {
    container: 'bottom-full left-1/2 mb-3 -translate-x-1/2',
    span: 'bottom-[-3px] left-1/2 -translate-x-1/2',
  },
  bottom: {
    container: 'top-full left-1/2 mt-3 -translate-x-1/2',
    span: 'top-[-3px] left-1/2 -translate-x-1/2',
  },
  left: {
    container: 'right-full top-1/2 mr-3 -translate-y-1/2',
    span: 'right-[-3px] top-1/2 -translate-y-1/2',
  },
  right: {
    container: 'left-full top-1/2 ml-3 -translate-y-1/2',
    span: 'left-[-3px] top-1/2 -translate-y-1/2',
  },
};

export const getClassesByPosition = (position: TooltipPosition) => {
  switch (position) {
    case 'top':
      return tooltipPosition.top;
    case 'bottom':
      return tooltipPosition.bottom;
    case 'left':
      return tooltipPosition.left;
    case 'right':
      return tooltipPosition.right;
  }
};

export const Tooltip = component$<TooltipProps>(({ label, position, open }) => {
  useStylesScoped$(styles);
  const store = useStore({
    hidden: true,
  });

  useTask$(({ track }) => {
    track(open);

    store.hidden = !open.value;

    if (!store.hidden) {
      const timer = setTimeout(() => {
        open.value = false;
      }, 1500);

      return () => {
        clearTimeout(timer);
      };
    }
  });

  const classes = getClassesByPosition(position);

  return (
    <div
      class={`${
        classes.container
      } r-tooltip absolute whitespace-nowrap rounded py-[6px] px-4 text-sm font-semibold ${
        store.hidden ? 'hidden' : ''
      }`}
    >
      <span class={`${classes.span} absolute -z-10 h-2 w-2 rotate-45 rounded-sm`}></span>
      {label}
    </div>
  );
});
