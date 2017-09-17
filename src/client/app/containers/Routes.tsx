import * as React from 'react';
import { Switch, withRouter } from 'react-router-dom';
import { graphql, compose, QueryProps, ChildProps } from 'react-apollo';
import { RoutesQuery } from 'schema';
import styled from '../../shared/styles/StyledComponents';
import Theme from '../../shared/constants/Theme';
import * as routesQuery from '../querySchema/Routes.graphql';
import PropsRoute from '../../shared/components/PropsRoute';
import PropsPrivateRoute from '../../shared/components/PropsPrivateRoute';
import withScrollSpy from '../../shared/components/withScrollSpy';
import FixedHeader from '../../shared/components/FixedHeader';
import LoginPage from '../../login/containers/LoginPage';
import GroupPage from '../../group/containers/GroupPage';
import ProjectPage from '../../project/containers/ProjectPage';
import TaskPage from '../../task/containers/TaskPage';
import SignupPage from '../../signup/containers/SignupPage';
import PhasePage from '../../phase/containers/PhasePage';
import ProfilePage from '../../profile/containers/ProfilePage';
import TimeUnitPage from '../../timeUnit/containers/TimeUnitPage';
import ReportPage from '../../report/containers/ReportPage';
import NavBar from './NavBar';

const SCROLL_HEIGHT = 44;
const Z_INDEX = 1000;

const MainContent = styled.div`padding: 0 0;`;

interface OwnProps {}

type Props = QueryProps &
  RoutesQuery & {
    y: number | null;
    isLogin: boolean;
  };

export function Routes({ y, isLogin }: Props) {
  const height = calculateHeight(y || 0);

  return (
    <div>
      <FixedHeader height={height} zIndex={Z_INDEX}>
        <NavBar />
      </FixedHeader>
      <MainContent>
        <Switch>
          <PropsPrivateRoute
            exact
            path="/"
            component={TimeUnitPage}
            isLogin={isLogin}
          />
          <PropsPrivateRoute
            path="/groups/:groupId/phases"
            component={PhasePage}
            isLogin={isLogin}
          />
          <PropsPrivateRoute
            path="/projects/:projectId/phases"
            component={PhasePage}
            isLogin={isLogin}
          />
          <PropsPrivateRoute
            path="/groups"
            component={GroupPage}
            isLogin={isLogin}
          />
          <PropsPrivateRoute
            path="/projects"
            component={ProjectPage}
            isLogin={isLogin}
          />
          <PropsPrivateRoute
            path="/phases"
            component={PhasePage}
            isLogin={isLogin}
          />
          <PropsPrivateRoute
            path="/profile"
            component={ProfilePage}
            isLogin={isLogin}
          />
          <PropsPrivateRoute
            path="/timeUnits/:date"
            component={TimeUnitPage}
            isLogin={isLogin}
          />
          <PropsPrivateRoute
            path="/report/:date"
            component={ReportPage}
            isLogin={isLogin}
          />
          <PropsPrivateRoute
            path="/tasks/:taskId"
            component={TaskPage}
            isLogin={isLogin}
          />
          <PropsPrivateRoute
            path="/timeUnits"
            component={TimeUnitPage}
            isLogin={isLogin}
          />
          <PropsPrivateRoute
            path="/report"
            component={ReportPage}
            isLogin={isLogin}
          />
          <PropsRoute path="/login" component={LoginPage} />
          <PropsRoute path="/signup" component={SignupPage} />
        </Switch>
      </MainContent>
    </div>
  );
}

const withData = compose(
  graphql<RoutesQuery, OwnProps, Props>(routesQuery, {
    props: ({ data }) => ({
      isLogin: data && data.currentUser,
    }),
  }),
  withScrollSpy(y => Math.min(y, SCROLL_HEIGHT)),
  withRouter,
);

export default withData(Routes);

function calculateHeight(y: number): number {
  const { compactHeightPx, heightPx } = Theme.navBar.default;

  return (
    heightPx - Math.min(1, y / SCROLL_HEIGHT) * (heightPx - compactHeightPx)
  );
}
