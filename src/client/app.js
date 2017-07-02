import React from 'react';
import ReactDOM from 'react-dom';
import { QueryRenderer, graphql } from 'react-relay';
import App from './components/App';
import Loading from './components/Loading';
import ErrorOutput from './components/ErrorOutput';
import createEnvironment from './boot/createEnvironment';
import injectMountNodeIfNeeded from './boot/injectMountNodeIfNeeded';
import { BrowserRouter as Router } from 'react-router-dom';

function renderRoot({ error, props }) {
  if (error) {
    return <ErrorOutput error={error} />;
  }

  if (!props) {
    return <Loading />;
  }

  return <Router><App {...props} /></Router>;
}

const query = graphql`
    query appQuery {
      viewer {
        ...App_viewer
      }
    }
  `;

const variables = {};

ReactDOM.render(
  <QueryRenderer
    environment={createEnvironment()}
    query={query}
    variables={variables}
    render={renderRoot}
  />,
  injectMountNodeIfNeeded(),
);