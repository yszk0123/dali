import { createLogger } from 'redux-logger';
import { applyMiddleware, createStore, combineReducers, compose } from 'redux';
import modalsReducer from '../reducers/modalsReducer';

const rootReducer = combineReducers({
  modals: modalsReducer,
});

export default function configureStore() {
  const composeEnhancers =
    (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

  const store = createStore(
    rootReducer,
    undefined,
    composeEnhancers(applyMiddleware(createLogger())),
  );

  return store;
}
