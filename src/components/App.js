/* @flow */
import type { App_viewer } from './__generated__/App_viewer.graphql';
import React from 'react';
import { Route, Link, withRouter } from 'react-router-dom';
import styled from 'styled-components';
import { createFragmentContainer, graphql } from 'react-relay';
import PropsRoute from '../common/PropsRoute';
import ProjectList from './ProjectList';
import TimeUnitList from './TimeUnitList';

const Wrapper = styled.div`
  padding: 1rem;
`;

type Props = { viewer: App_viewer };
export function App({ viewer }: Props) {
  return (
    <Wrapper>
      <ul>
        <li><Link to="/">Dashboard</Link></li>
        <li><Link to="/yesterday">Yesterday</Link></li>
        <li><Link to="/today">Today</Link></li>
        <li><Link to="/tomorrow">Tomorrow</Link></li>
        <li><Link to="/workspace">Workspace</Link></li>
        <li><Link to="/project">Project</Link></li>
        <li><Link to="/dailyReport">DailyReport</Link></li>
        <li><Link to="/options">Options</Link></li>
        <li><Link to="/profile">Profile</Link></li>
        <li><Link to="/dailyReportTemplate">DailyReportTemplate</Link></li>
      </ul>
      <Route
        exact
        path="/"
        render={() =>
          <div>
            <h1>Hello, {viewer.name}!</h1>
            <ProjectList viewer={viewer} />
            <TimeUnitList viewer={viewer} />
          </div>}
      />
      <PropsRoute path="/yesterday" component={TimeUnitList} viewer={viewer} />
      <PropsRoute path="/today" component={TimeUnitList} viewer={viewer} />
      <PropsRoute path="/tomorrow" component={TimeUnitList} viewer={viewer} />
      <PropsRoute path="/project" component={ProjectList} viewer={viewer} />
    </Wrapper>
  );
}

export default withRouter(
  createFragmentContainer(
    App,
    graphql`
    fragment App_viewer on User {
      id
      name
      ...ProjectList_viewer
      ...TimeUnitList_viewer
    }
  `,
  ),
);
