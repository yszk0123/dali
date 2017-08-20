import * as React from 'react';
import { Switch, withRouter } from 'react-router-dom';
import { graphql, compose, QueryProps, ChildProps } from 'react-apollo';
import styled from 'styled-components';
import { RoutesQuery } from 'schema';
import * as routesQuery from '../../graphql/querySchema/Routes.graphql';
import PropsRoute from '../../shared/components/PropsRoute';
import PropsPrivateRoute from '../../shared/components/PropsPrivateRoute';
import Dummy from '../Dummy';
import DateSwitch from './DateSwitch';
// import DashboardPage from './DashboardPage';
// import SchedulePage from './SchedulePage';
import LoginPage from './LoginPage';
import NavBar from './NavBar';
import ProjectsPage from './ProjectsPage';
import SignupPage from './SignupPage';
import TasksPage from './TasksPage';
import ProfilePage from './ProfilePage';
const DashboardPage = Dummy;

const MainContent = styled.div`margin: 1.8rem;`;

interface RoutesProps {
  isLogin: boolean;
}

type Props = QueryProps & RoutesQuery & RoutesProps;

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
            component={TasksPage}
            isLogin={isLogin}
          />
          <PropsPrivateRoute
            path="/profile"
            component={ProfilePage}
            isLogin={isLogin}
          />
          <DateSwitch isLogin={isLogin} />
          <PropsRoute path="/login" component={LoginPage} />
          <PropsRoute path="/signup" component={SignupPage} />
        </Switch>
      </MainContent>
    </div>
  );
}

const withData = compose(
  graphql<RoutesQuery, {}, Props>(routesQuery, {
    props: ({ data }) => ({
      isLogin: data && data.currentUser,
    }),
  }),
  withRouter,
);

export default withData(Routes);
