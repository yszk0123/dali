/* @flow */
import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import styled from 'styled-components';
import { createFragmentContainer, graphql } from 'react-relay';
import PropsRoute from '../../shared/components/PropsRoute';
import type { App_viewer } from './__generated__/App_viewer.graphql';
import ProjectsPage from './ProjectsPage';
import DashboardPage from './DashboardPage';
import TodayPage from './TodayPage';
import WorkspacePage from './WorkspacePage';

const Wrapper = styled.div`padding: 1.5rem;`;

type Props = { viewer: App_viewer };
export function App({ viewer }: Props) {
  return (
    <Wrapper>
      <ul>
        <li>
          <Link to="/">Dashboard</Link>
        </li>
        <li>
          <Link to="/today">Today</Link>
        </li>
        <li>
          <Link to="/projects">Projects</Link>
        </li>
        <li>
          <Link to="/workspace">Workspace</Link>
        </li>
        <li>
          <Link to="/dailyReport">DailyReport</Link>
        </li>
        <li>
          <Link to="/options">Options</Link>
        </li>
        <li>
          <Link to="/profile">Profile</Link>
        </li>
        <li>
          <Link to="/dailyReportTemplate">DailyReportTemplate</Link>
        </li>
      </ul>
      <PropsRoute exact path="/" component={DashboardPage} viewer={viewer} />
      <PropsRoute path="/today" component={TodayPage} viewer={viewer} />
      <PropsRoute path="/projects" component={ProjectsPage} viewer={viewer} />
      <PropsRoute path="/workspace" component={WorkspacePage} viewer={viewer} />
    </Wrapper>
  );
}

export default withRouter(
  createFragmentContainer(
    App,
    graphql`
      fragment App_viewer on User {
        id
        ...TodayPage_viewer
        ...ProjectsPage_viewer
        ...WorkspacePage_viewer
      }
    `,
  ),
);
