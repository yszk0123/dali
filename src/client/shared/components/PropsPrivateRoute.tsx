// Workaround to pass props to component with <Route />
// https://github.com/ReactTraining/react-router/issues/4105#issuecomment-289195202
import * as React from 'react';
import { Route, Redirect } from 'react-router-dom';

function renderMergedProps(component: any, ...rest: any[]) {
  const finalProps = Object.assign({}, ...rest);
  return React.createElement(component, finalProps);
}

interface Props {
  component: any;
  exact?: boolean;
  isLogin: boolean;
  path: string;
}

export default function PropsPrivateRoute({
  component,
  isLogin,
  ...rest,
}: Props) {
  return (
    <Route
      {...rest}
      render={routeProps => {
        if (!isLogin) {
          return (
            <Redirect
              to={{ pathname: '/login', state: { from: routeProps.location } }}
            />
          );
        }

        return renderMergedProps(component, routeProps, rest);
      }}
    />
  );
}
