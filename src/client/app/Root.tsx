import HTML5Backend from 'react-dnd-html5-backend';
import TouchBackend from 'react-dnd-touch-backend';
import { DragDropContextProvider } from 'react-dnd';
import * as React from 'react';
import {
  ApolloClient,
  ApolloProvider,
  createNetworkInterface,
} from 'react-apollo';
import { BrowserRouter as Router } from 'react-router-dom';
import { dataIdFromObject, isTouchSupported } from '../shared/utils';
import { Theme } from '../shared/constants';
import { ThemeProvider } from '../shared/styles';
import App from './containers/App';

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
            <App />
          </Router>
        </ThemeProvider>
      </ApolloProvider>
    </DragDropContextProvider>
  );
}
