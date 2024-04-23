import { ChartData } from './clicks-chart';

export function getDateFormatter(daysDuration: number): (value: Date | string) => string {
  if (daysDuration === 1) {
    return (value) =>
      new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }).format(new Date(value));
  } else if (daysDuration === 365) {
    return (value) =>
      new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }).format(new Date(value));
  }
  return (value) =>
    new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
    }).format(new Date(value));
}

export function fillMissingDates(data: { day: string; count: string }[], durationDays: number): ChartData {
  const endDate = new Date();
  const startDate = new Date();

  const filledData: ChartData = [];

  if (durationDays === 1) {
    // Cover a full day, adding missing hours if needed
    startDate.setHours(endDate.getHours() - 24, 0, 0, 0);
    fillHours(startDate, endDate, data, filledData);
  } else if (durationDays === 7 || durationDays === 30) {
    // Cover each day for a week or a month
    startDate.setDate(endDate.getDate() - durationDays + 1);
    fillDays(startDate, endDate, data, filledData);
  } else if (durationDays === 365) {
    // Cover each week for a year
    startDate.setFullYear(endDate.getFullYear() - 1);
    fillWeeks(startDate, endDate, data, filledData);
  }

  return filledData;
}

function fillHours(startDate: Date, endDate: Date, data: { day: string; count: string }[], filledData: ChartData) {
  const filledHoursMap = new Map<number, boolean>();
  data.forEach((entry) => {
    const d = new Date(entry.day);
    filledHoursMap.set(d.getHours(), true);
    filledData.push({ x: d, y: parseInt(entry.count, 10) });
  });

  for (let d = new Date(startDate); d <= endDate; d.setHours(d.getHours() + 1)) {
    if (filledHoursMap.has(d.getHours())) {
      continue;
    }
    filledData.push({ x: new Date(d), y: 0 });
  }

  return filledData.sort((a, b) => a.x.getTime() - b.x.getTime());
}

function fillDays(startDate: Date, endDate: Date, data: { day: string; count: string }[], filledData: ChartData) {
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const entry = data.find((entry) => entry.day.slice(0, 10) === d.toISOString().slice(0, 10));
    if (entry) {
      filledData.push({ x: new Date(entry.day), y: parseInt(entry.count, 10) });
    } else {
      filledData.push({ x: new Date(d), y: 0 });
    }
  }
}

function fillWeeks(startDate: Date, endDate: Date, data: { day: string; count: string }[], filledData: ChartData) {
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 7)) {
    const endOfWeek = new Date(d);
    endOfWeek.setDate(d.getDate() + 7);
    const entriesForWeek = data.filter((entry) => {
      const entryDate = new Date(entry.day);
      return entryDate >= d && entryDate < endOfWeek;
    });
    const weekTotal = entriesForWeek.reduce((sum, entry) => sum + parseInt(entry.count, 10), 0);
    filledData.push({ x: new Date(d), y: weekTotal });
  }
}
