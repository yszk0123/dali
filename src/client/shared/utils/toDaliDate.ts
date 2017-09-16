import { DateOnly } from '../../app/interfaces';

function pad(n: number): string {
  return n < 10 ? `0${n}` : `${n}`;
}

export default function toDaliDate(dirtyDate: Date): DateOnly {
  const year = dirtyDate.getFullYear();
  const month = dirtyDate.getMonth();
  const date = dirtyDate.getDate();

  return `${year}-${pad(month + 1)}-${pad(date)}`;
}
