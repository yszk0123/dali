/* @flow */
import React from 'react';
import { Switch, withRouter } from 'react-router-dom';
import styled from 'styled-components';
import { createFragmentContainer, graphql } from 'react-relay';
import PropsRoute from '../../shared/components/PropsRoute';
import DailySwitch from './DailySwitch';
import DashboardPage from './DashboardPage';
import NavBar from './NavBar';
import ProjectsPage from './ProjectsPage';
import TaskSetsPage from './TaskSetsPage';

const Wrapper = styled.div`padding: 1.5rem;`;

export class App extends React.Component {
  render() {
    const { viewer } = this.props;

    return (
      <Wrapper>
        <NavBar />
        <Switch>
          <PropsRoute
            exact
            path="/"
            component={DashboardPage}
            viewer={viewer}
          />
          <PropsRoute
            path="/projects"
            component={ProjectsPage}
            viewer={viewer}
          />
          <PropsRoute
            path="/taskSets"
            component={TaskSetsPage}
            viewer={viewer}
          />
          <PropsRoute path="/daily" component={DailySwitch} viewer={viewer} />
        </Switch>
      </Wrapper>
    );
  }
}

export default withRouter(
  createFragmentContainer(
    App,
    graphql.experimental`
      fragment App_viewer on User {
        id
        ...DailySwitch_viewer
        ...ProjectsPage_viewer
        ...TaskSetsPage_viewer
      }
    `,
  ),
);
