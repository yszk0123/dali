/* @flow */
import React from 'react';
import { Switch, withRouter } from 'react-router-dom';
import { graphql, compose } from 'react-apollo';
import type { OperationComponent, QueryProps } from 'react-apollo';
import styled from 'styled-components';
import type { RoutesQuery } from 'schema.graphql';
import routesQuery from '../../graphql/querySchema/Routes.graphql';
import PropsRoute from '../../shared/components/PropsRoute';
import PropsPrivateRoute from '../../shared/components/PropsPrivateRoute';
import Dummy from '../Dummy';
// import DailySwitch from './DailySwitch';
// import DashboardPage from './DashboardPage';
import LoginPage from './LoginPage';
import NavBar from './NavBar';
import ProjectsPage from './ProjectsPage';
// import SignupPage from './SignupPage';
// import TaskSetsPage from './TaskSetsPage';
const DailySwitch = Dummy;
const DashboardPage = Dummy;
const SignupPage = Dummy;
const TaskSetsPage = Dummy;

const MainContent = styled.div`margin: 1.8rem;`;

type Props = {
  ...QueryProps,
  ...RoutesQuery,
  isLogin: boolean,
};

export function Routes({ isLogin }: Props) {
  return (
    <div>
      <NavBar />
      <MainContent>
        <Switch>
          <PropsPrivateRoute
            exact
            path="/"
            component={DashboardPage}
            isLogin={isLogin}
          />
          <PropsPrivateRoute
            path="/projects"
            component={ProjectsPage}
            isLogin={isLogin}
          />
          <PropsPrivateRoute
            path="/taskSets"
            component={TaskSetsPage}
            isLogin={isLogin}
          />
          <PropsPrivateRoute
            path="/daily"
            component={DailySwitch}
            isLogin={isLogin}
          />
          <PropsRoute path="/login" component={LoginPage} isLogin={isLogin} />
          <PropsRoute path="/signup" component={SignupPage} isLogin={isLogin} />
        </Switch>
      </MainContent>
    </div>
  );
}

const withData: OperationComponent<RoutesQuery, {}, Props> = compose(
  graphql(routesQuery, {
    props: ({ data }) => ({
      isLogin: data && data.currentUser,
    }),
  }),
  withRouter,
);

export default withData(Routes);
