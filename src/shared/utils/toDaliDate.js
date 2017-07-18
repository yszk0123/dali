/* @flow */

export default function toDaliDate(dirtyDate: Date): Date {
  const year = dirtyDate.getFullYear();
  const month = dirtyDate.getMonth();
  const date = dirtyDate.getDate();
  const hours = dirtyDate.getHours();
  const minutes = dirtyDate.getMinutes();

  return new Date(Date.UTC(year, month, date, hours, minutes));
}
