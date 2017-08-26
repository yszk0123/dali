// Workaround to pass props to component with <Route />
// https://github.com/ReactTraining/react-router/issues/4105#issuecomment-289195202
import * as React from 'react';
import { Route } from 'react-router-dom';

function renderMergedProps(component: any, ...rest: any[]) {
  const finalProps = Object.assign({}, ...rest);
  return React.createElement(component, finalProps);
}

interface Props {
  component: any;
  path?: string;
}

export default function PropsRoute({ component, ...rest }: Props) {
  return (
    <Route
      {...rest}
      render={routeProps => {
        return renderMergedProps(component, routeProps, rest);
      }}
    />
  );
}
