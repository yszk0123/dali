function pad(n: number): string {
  return n < 10 ? `0${n}` : `${n}`;
}

export default function formatDaliDate(dirtyDate: Date): string {
  const year = dirtyDate.getUTCFullYear();
  const month = dirtyDate.getUTCMonth();
  const date = dirtyDate.getUTCDate();
  return `${year}-${pad(month)}-${pad(date)}`;
}
