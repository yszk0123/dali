/* @flow */
import { startOfDay } from 'date-fns';

const THIRTY_MINUTES_IN_MILLISECONDS = 30 * 60 * 1000;

export default function getPositionFromDate(date: Date): number {
  const dt = date - startOfDay(date);

  return Math.floor(dt / THIRTY_MINUTES_IN_MILLISECONDS);
}
