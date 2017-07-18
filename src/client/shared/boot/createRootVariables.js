/* @flow */
import toDaliDate from '../../../shared/utils/toDaliDate';

export default function createRootVariables() {
  const currentDate = new Date();

  return {
    defaultDate: toDaliDate(currentDate),
  };
}
