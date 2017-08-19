/* @flow */
import {
  CLOSE_ADD_TASK_UNIT_MODAL,
  CLOSE_LINK_PROJECT_UNIT_MODAL,
  OPEN_ADD_TASK_UNIT_MODAL,
  OPEN_LINK_PROJECT_UNIT_MODAL,
} from '../constants/ActionTypes';

export default function modalsReducer(state: any = {}, action: any) {
  switch (action.type) {
    case OPEN_ADD_TASK_UNIT_MODAL: {
      const { timeUnitId } = action.payload;

      return {
        ...state,
        timeUnitId,
      };
    }
    case CLOSE_ADD_TASK_UNIT_MODAL: {
      return {
        ...state,
        timeUnitId: null,
      };
    }
    case OPEN_LINK_PROJECT_UNIT_MODAL: {
      const { taskSetId } = action.payload;

      return {
        ...state,
        taskSetId,
      };
    }
    case CLOSE_LINK_PROJECT_UNIT_MODAL: {
      return {
        ...state,
        taskSetId: null,
      };
    }
    default:
      return state;
  }
}
