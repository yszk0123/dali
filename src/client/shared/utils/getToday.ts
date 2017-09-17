import { DateOnly } from '../interfaces';
import toDaliDate from './toDaliDate';

export default function getToday(): DateOnly {
  return toDaliDate(new Date());
}
