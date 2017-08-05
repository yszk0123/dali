/* @flow */
import HTML5Backend from 'react-dnd-html5-backend';
import TouchBackend from 'react-dnd-touch-backend';
// FIXME: add missing type declaration for react-dnd
// $FlowFixMe
import { DragDropContextProvider } from 'react-dnd';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import {
  ApolloClient,
  ApolloProvider,
  createNetworkInterface,
} from 'react-apollo';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import isTouchSupported from '../shared/utils/isTouchSupported';
import configureStore from '../redux/boot/configureStore';
import Theme from './constants/Theme';
import injectMountNodeIfNeeded from './boot/injectMountNodeIfNeeded';
import registerServiceWorker from './boot/registerServiceWorker';
import setupClipboard from './boot/setupClipboard';
import App from './containers/App';

const store = configureStore();

const dragDropBackend = isTouchSupported() ? TouchBackend : HTML5Backend;

// TODO: Don't use any
const _createNetworkInterface = (createNetworkInterface: any);

const client = new ApolloClient({
  dataIdFromObject: o => `${o.__typename}:${o.id}`,
  networkInterface: _createNetworkInterface({
    uri: '/graphql', // TODO: Don't specify port directly
    opts: {
      credentials: 'same-origin',
    },
  }),
});

function Root() {
  return (
    <DragDropContextProvider backend={dragDropBackend}>
      <ApolloProvider client={client}>
        <ThemeProvider theme={Theme}>
          <Router>
            <Provider store={store}>
              <App />
            </Provider>
          </Router>
        </ThemeProvider>
      </ApolloProvider>
    </DragDropContextProvider>
  );
}

ReactDOM.render(<Root />, injectMountNodeIfNeeded());

setupClipboard();

if (process.env.NODE_ENV === 'production') {
  registerServiceWorker();
}
