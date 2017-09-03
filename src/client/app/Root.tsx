import HTML5Backend from 'react-dnd-html5-backend';
import TouchBackend from 'react-dnd-touch-backend';
import { DragDropContextProvider } from 'react-dnd';
import * as React from 'react';
import { Provider } from 'react-redux';
import {
  ApolloClient,
  ApolloProvider,
  createNetworkInterface,
} from 'react-apollo';
import { BrowserRouter as Router } from 'react-router-dom';
import dataIdFromObject from '../shared/utils/dataIdFromObject';
import isTouchSupported from '../shared/utils/isTouchSupported';
import configureStore from '../redux/factories/configureStore';
import Theme from './constants/Theme';
import App from './containers/App';
import { ThemeProvider } from './styles/StyledComponents';

const store = configureStore();

const dragDropBackend = isTouchSupported() ? TouchBackend : HTML5Backend;

const client = new ApolloClient({
  dataIdFromObject,
  networkInterface: createNetworkInterface({
    uri: '/graphql', // TODO: Don't specify port directly
    opts: {
      credentials: 'same-origin',
    },
  }),
});

export default function Root() {
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
