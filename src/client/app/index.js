import React from 'react';
import ReactDOM from 'react-dom';
import { QueryRenderer, graphql } from 'react-relay';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './components/App';
import Loading from './components/Loading';
import ErrorOutput from './components/ErrorOutput';
import createEnvironment from './boot/createEnvironment';
import injectMountNodeIfNeeded from './boot/injectMountNodeIfNeeded';
import setupClipboard from './boot/setupClipboard';
import createRootVariables from './boot/createRootVariables';

function renderRoot({ error, props }) {
  if (error) {
    return <ErrorOutput error={error} />;
  }

  if (!props) {
    return <Loading />;
  }

  return (
    <Router>
      <App {...props} />
    </Router>
  );
}

const query = graphql.experimental`
  query appQuery($defaultDate: Date!, $defaultPosition: Int!) {
    viewer {
      ...App_viewer @arguments(date: $defaultDate, position: $defaultPosition)
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
