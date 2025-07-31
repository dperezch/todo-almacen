export const normalizeDate = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

export const getWeekDates = (weekOffset = 0): Date[] => {
  const today = new Date();
  const currentWeek = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );
  const dayOfWeek = currentWeek.getDay();
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

  const monday = new Date(currentWeek);
  monday.setDate(currentWeek.getDate() + mondayOffset + weekOffset * 7);

  const dates = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    dates.push(date);
  }
  return dates;
};

export const isSameDate = (date1: Date, date2: Date): boolean => {
  const normalized1 = normalizeDate(date1);
  const normalized2 = normalizeDate(date2);
  return normalized1.getTime() === normalized2.getTime();
};
