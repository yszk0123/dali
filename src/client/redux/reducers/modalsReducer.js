/* @flow */
import {
  CLOSE_ADD_TASK_UNIT_MODAL,
  OPEN_ADD_TASK_UNIT_MODAL,
} from '../constants/ActionTypes';

export default function modalsReducer(state = {}, action) {
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
    default:
      return state;
  }
}
