/* @flow */
import React from 'react';
import { Switch, withRouter } from 'react-router-dom';
import styled from 'styled-components';
import { createFragmentContainer, graphql } from 'react-relay';
import PropsRoute from '../../shared/components/PropsRoute';
import PropsPrivateRoute from '../../shared/components/PropsPrivateRoute';
import DailySwitch from './DailySwitch';
import DashboardPage from './DashboardPage';
import LoginPage from './LoginPage';
import NavBar from './NavBar';
import ProjectsPage from './ProjectsPage';
import SignupPage from './SignupPage';
import TaskSetsPage from './TaskSetsPage';

const Wrapper = styled.div`padding: 0.5rem;`;
const MainContent = styled.div`
  margin: 0.5rem;
  padding: 1.3rem;
`;

export class App extends React.Component {
  render() {
    const { viewer, relay } = this.props;

    return (
      <Wrapper>
        <NavBar viewer={viewer} />
        <MainContent>
          <Switch>
            <PropsPrivateRoute
              exact
              path="/"
              component={DashboardPage}
              viewer={viewer}
            />
            <PropsPrivateRoute
              path="/projects"
              component={ProjectsPage}
              viewer={viewer}
            />
            <PropsPrivateRoute
              path="/taskSets"
              component={TaskSetsPage}
              viewer={viewer}
            />
            <PropsPrivateRoute
              path="/daily"
              component={DailySwitch}
              viewer={viewer}
            />
            <PropsRoute
              path="/login"
              component={LoginPage}
              viewer={viewer}
              relay={relay}
            />
            <PropsRoute
              path="/signup"
              component={SignupPage}
              viewer={viewer}
              relay={relay}
            />
          </Switch>
        </MainContent>
      </Wrapper>
    );
  }
}

export default withRouter(
  createFragmentContainer(
    App,
    graphql.experimental`
      fragment App_viewer on User
        @argumentDefinitions(date: { type: "Date!" }) {
        id
        ...DailySwitch_viewer @arguments(date: $date)
        ...DashboardPage_viewer @arguments(date: $date)
        ...NavBar_viewer
        ...ProjectsPage_viewer
        ...TaskSetsPage_viewer
      }
    `,
  ),
);
