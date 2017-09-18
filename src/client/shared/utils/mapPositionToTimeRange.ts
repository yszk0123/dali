function pad(n: number): string {
  return n < 10 ? `0${n}` : '' + n;
}

export default function mapPositionToTimeRange(position: number): string {
  const odd = position % 2 === 0;
  const startHour = pad(Math.floor(position / 2));
  const startMinute = odd ? '00' : '30';

  return `${startHour}:${startMinute}`;
}
