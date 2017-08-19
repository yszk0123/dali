import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { QueryRenderer, graphql } from 'react-relay';
import createRootVariables from '../shared/boot/createRootVariables';
import App from './containers/App';
import createEnvironment from './boot/createEnvironment';
import injectMountNodeIfNeeded from './boot/injectMountNodeIfNeeded';

function renderRoot({ error, props }) {
  return <App {...props} />;
}

const query = graphql.experimental`
  query appQuery($defaultDate: Date!) {
    viewer {
      ...App_viewer @arguments(date: $defaultDate)
    }
  }
`;

ReactDOM.render(
  <QueryRenderer
    environment={createEnvironment()}
    query={query}
    variables={createRootVariables()}
    render={renderRoot}
  />,
  injectMountNodeIfNeeded(),
);
