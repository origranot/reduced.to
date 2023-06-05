export const DAY_IN_MILLISECONDS = 1000 * 24 * 60 * 60;

export const TIME_FRAME_DIR = {
  DAY: { name: 'Day', value: DAY_IN_MILLISECONDS },
  THREE_DAYS: { name: '3 Days', value: DAY_IN_MILLISECONDS * 3 },
  ONE_WEEK: { name: '1 Week', value: DAY_IN_MILLISECONDS * 7 },
  NEVER: { name: '1 Week', value: null },
};
