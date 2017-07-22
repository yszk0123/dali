/* @flow */
import { OPEN_LINK_PROJECT_UNIT_MODAL } from '../constants/ActionTypes';

export default function openLinkProjectModal({ taskSetId }) {
  return {
    type: OPEN_LINK_PROJECT_UNIT_MODAL,
    payload: { taskSetId },
  };
}
