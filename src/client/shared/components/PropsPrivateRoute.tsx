// Workaround to pass props to component with <Route />
// https://github.com/ReactTraining/react-router/issues/4105#issuecomment-289195202
import * as React from 'react';
import { Route, Redirect } from 'react-router-dom';

interface Props {
  component: any;
  exact?: boolean;
  isLogin: boolean;
  path: string;
}

export default function PropsPrivateRoute<T>(props: Props & T) {
  // FIXME: Avoid any
  const { component, isLogin, ...rest } = props as any;

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

        return React.createElement(component, { ...routeProps, ...rest });
      }}
    />
  );
}
