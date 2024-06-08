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

// Function to format the date with the "Renews on March 25th, 2023" format
export const formatRenewalDate = (date: Date): string => {
  const options: Intl.DateTimeFormatOptions = {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  };

  const dateString = date.toLocaleDateString('en-US', options);

  const day = date.getDate();
  const daySuffix = (day: number): string => {
    if (day > 3 && day < 21) return 'th'; // catch 11th, 12th, 13th
    switch (day % 10) {
      case 1:
        return 'st';
      case 2:
        return 'nd';
      case 3:
        return 'rd';
      default:
        return 'th';
    }
  };

  return dateString.replace(`${day}`, `${day}${daySuffix(day)}`);
};
