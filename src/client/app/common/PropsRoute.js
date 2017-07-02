// Workaround to pass props to component with <Route />
// https://github.com/ReactTraining/react-router/issues/4105#issuecomment-289195202
import React from 'react';
import { Route } from 'react-router-dom';

function renderMergedProps(component, ...rest) {
  const finalProps = Object.assign({}, ...rest);
  return React.createElement(component, finalProps);
}

export default function PropsRoute({ component, ...rest }) {
  return (
    <Route
      {...rest}
      render={routeProps => {
        return renderMergedProps(component, routeProps, rest);
      }}
    />
  );
}
