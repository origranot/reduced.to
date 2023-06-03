const currentDate = new Date();
const timestamp = currentDate.getTime();
export const todayEpochTime = Math.floor(timestamp / 1000);

export const dayInSeconds = 1 * 24 * 60 * 60;

export const timeFrameArr = [
  { key: 'Day', value: todayEpochTime + dayInSeconds },
  { key: '3 Days', value: todayEpochTime + 3 * dayInSeconds },
  { key: '1 Week', value: todayEpochTime + 7 * dayInSeconds },
];
