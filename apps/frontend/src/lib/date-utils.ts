const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export const getMonthName = (month: number): string => MONTH_NAMES[month];

export const formatDate = (date: Date): string => {
  return `${formatDateDay(date)} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date
    .getSeconds()
    .toString()
    .padStart(2, '0')}`;
};

export const formatDateDay = (date: Date): string => {
  return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
};

export const tomorrow = (): Date => {
  const date = new Date();
  date.setDate(date.getDate() + 1);

  return date;
};
