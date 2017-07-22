/* @flow */
import { OPEN_ADD_TASK_UNIT_MODAL } from '../constants/ActionTypes';

export default function openAddTaskUnitModal({ timeUnitId }) {
  return {
    type: OPEN_ADD_TASK_UNIT_MODAL,
    payload: { timeUnitId },
  };
}
