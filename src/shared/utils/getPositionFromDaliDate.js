/* @flow */

export default function getPositionFromDaliDate(date: Date): number {
  const dateInMinutes = date.getHours() * 60 * date.getMinutes();

  return Math.floor(dateInMinutes / 30);
}
