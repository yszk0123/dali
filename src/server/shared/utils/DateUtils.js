/* @flow */
export function startOfDay(dateTime: Date): Date {
  const year = dateTime.getUTCFullYear();
  const month = dateTime.getUTCMonth();
  const date = dateTime.getUTCDate();

  return new Date(Date.UTC(year, month, date));
}
