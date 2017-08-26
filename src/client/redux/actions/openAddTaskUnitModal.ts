import { OPEN_ADD_TASK_UNIT_MODAL } from '../constants/ActionTypes';

interface Input {
  timeUnitId: string;
}

export default function openAddTaskUnitModal({ timeUnitId }: Input) {
  return {
    type: OPEN_ADD_TASK_UNIT_MODAL,
    payload: { timeUnitId },
  };
}
