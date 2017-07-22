import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContextProvider } from 'react-dnd';
import { QueryRenderer, graphql } from 'react-relay';
import { BrowserRouter as Router } from 'react-router-dom';
import createRootVariables from '../shared/boot/createRootVariables';
import configureStore from '../redux/boot/configureStore';
import App from './components/App';
import Loading from './components/Loading';
import ErrorOutput from './components/ErrorOutput';
import createEnvironment from './boot/createEnvironment';
import injectMountNodeIfNeeded from './boot/injectMountNodeIfNeeded';
import setupClipboard from './boot/setupClipboard';
import registerServiceWorker from './boot/registerServiceWorker';

const store = configureStore();

function renderRoot({ error, props }) {
  if (error) {
    return <ErrorOutput error={error} />;
  }

  if (!props) {
    return <Loading />;
  }

  return (
    <DragDropContextProvider backend={HTML5Backend}>
      <Provider store={store}>
        <Router>
          <App {...props} />
        </Router>
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
