import { combineReducers, createStore } from 'redux';
import modalsReducer from '../reducers/modalsReducer';

const rootReducer = combineReducers({
  modals: modalsReducer,
});

export default function configureStore() {
  return createStore(rootReducer);
}
