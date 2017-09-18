import * as React from 'react';
import { Switch, withRouter } from 'react-router-dom';
import { graphql, compose, QueryProps, ChildProps } from 'react-apollo';
import { RoutesQuery as Query } from 'schema';
import { styled } from '../../shared/styles';
import { Theme } from '../../shared/constants';
import * as QUERY from '../querySchema/Routes.graphql';
import {
  PropsRoute,
  PropsPrivateRoute,
  FixedHeader,
  withScrollSpy,
} from '../../shared/components';
import { LoginPage } from '../../login';
import { GroupPage } from '../../group';
import { ProjectPage } from '../../project';
import { ActionPage } from '../../action';
import { SignupPage } from '../../signup';
import { TaskPage } from '../../task';
import { ProfilePage } from '../../profile';
import { PeriodPage } from '../../period';
import { ReportPage } from '../../report';
import NavBar from './NavBar';

const SCROLL_HEIGHT = 44;
const Z_INDEX = 1000;

const MainContent = styled.div`padding: 0 0;`;

interface OwnProps {}

type Props = QueryProps &
  Query & {
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
            component={PeriodPage}
            isLogin={isLogin}
          />
          <PropsPrivateRoute
            path="/groups/:groupId/tasks"
            component={TaskPage}
            isLogin={isLogin}
          />
          <PropsPrivateRoute
            path="/projects/:projectId/tasks"
            component={TaskPage}
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
            path="/tasks"
            component={TaskPage}
            isLogin={isLogin}
          />
          <PropsPrivateRoute
            path="/profile"
            component={ProfilePage}
            isLogin={isLogin}
          />
          <PropsPrivateRoute
            path="/periods/:date"
            component={PeriodPage}
            isLogin={isLogin}
          />
          <PropsPrivateRoute
            path="/report/:date"
            component={ReportPage}
            isLogin={isLogin}
          />
          <PropsPrivateRoute
            path="/actions/:actionId"
            component={ActionPage}
            isLogin={isLogin}
          />
          <PropsPrivateRoute
            path="/periods"
            component={PeriodPage}
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
  graphql<Query, OwnProps, Props>(QUERY, {
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
