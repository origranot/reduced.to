export const MINUTE_IN_MILLISECONDS = 1000 * 60;
export const HOUR_IN_MILLISECONDS = MINUTE_IN_MILLISECONDS * 60;
export const DAY_IN_MILLISECONDS = HOUR_IN_MILLISECONDS * 24;

export const TIME_FRAME_DIR = {
  ONE_HOUR: { name: '1 Hour', value: HOUR_IN_MILLISECONDS },
  THREE_HOURS: { name: '3 Hours', value: HOUR_IN_MILLISECONDS * 3 },
  DAY: { name: '1 Day', value: DAY_IN_MILLISECONDS },
  THREE_DAYS: { name: '3 Days', value: DAY_IN_MILLISECONDS * 3 },
  ONE_WEEK: { name: '1 Week', value: DAY_IN_MILLISECONDS * 7 },
  NEVER: { name: 'Never', value: null },
};
