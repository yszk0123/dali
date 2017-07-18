/* @flow */
import toDaliDate from '../../../shared/utils/toDaliDate';
import getPositionFromDate from '../../../shared/utils/getPositionFromDate';

export default function createRootVariables() {
  const currentDate = new Date();

  return {
    defaultDate: toDaliDate(currentDate),
    defaultPosition: getPositionFromDate(currentDate),
  };
}
