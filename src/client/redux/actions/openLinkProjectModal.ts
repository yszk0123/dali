import { OPEN_LINK_PROJECT_UNIT_MODAL } from '../constants/ActionTypes';

interface Input {
  taskSetId: string;
}

export default function openLinkProjectModal({ taskSetId }: Input) {
  return {
    type: OPEN_LINK_PROJECT_UNIT_MODAL,
    payload: { taskSetId },
  };
}
