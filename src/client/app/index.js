import HTML5Backend from 'react-dnd-html5-backend';
import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from 'styled-components';
import TouchBackend from 'react-dnd-touch-backend';
import { BrowserRouter as Router } from 'react-router-dom';
import { DragDropContextProvider } from 'react-dnd';
import { Provider } from 'react-redux';
import { QueryRenderer, graphql } from 'react-relay';
import createRootVariables from '../shared/boot/createRootVariables';
import isTouchSupported from '../shared/utils/isTouchSupported';
import configureStore from '../redux/boot/configureStore';
import Theme from './constants/Theme';
import App from './containers/App';
import Loading from './components/Loading';
import ErrorOutput from './components/ErrorOutput';
import createEnvironment from './boot/createEnvironment';
import injectMountNodeIfNeeded from './boot/injectMountNodeIfNeeded';
import setupClipboard from './boot/setupClipboard';
import registerServiceWorker from './boot/registerServiceWorker';

const store = configureStore();
const dragDropBackend = isTouchSupported() ? TouchBackend : HTML5Backend;

function renderRoot({ error, props }) {
  if (error) {
    return <ErrorOutput error={error} />;
  }

  if (!props) {
    return <Loading />;
  }

  return (
    <DragDropContextProvider backend={dragDropBackend}>
      <Provider store={store}>
        <ThemeProvider theme={Theme}>
          <Router>
            <App {...props} />
          </Router>
        </ThemeProvider>
      </Provider>
    </DragDropContextProvider>
  );
}

const query = graphql.experimental`
  query appQuery($defaultDate: Date!) {
    viewer {
      ...App_viewer @arguments(date: $defaultDate)
    }
  }
`;

setupClipboard();

ReactDOM.render(
  <QueryRenderer
    environment={createEnvironment()}
    query={query}
    variables={createRootVariables()}
    render={renderRoot}
  />,
  injectMountNodeIfNeeded(),
);

if (process.env.NODE_ENV === 'production') {
  registerServiceWorker();
}
