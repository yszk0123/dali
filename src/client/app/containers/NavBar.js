/* @flow */
import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { graphql, compose, withApollo } from 'react-apollo';
import type { OperationComponent, QueryProps } from 'react-apollo';
import type { NavBarQuery } from 'schema.graphql';
import LogoutMutation from '../../graphql/typeDefs/LogoutMutation';
import LogoutMutationString from '../../graphql/typeDefs/LogoutMutation.graphql';
import navBarQuery from '../../graphql/querySchema/NavBar.graphql';
import Button from '../components/Button';

const NavBarWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 0 0.6rem;
  overflow-x: scroll;
  background: #112ca5;
`;

const NavBarItem = styled.div`
  margin: 0.8rem 0.4rem;

  a {
    color: #c8cfef;
    text-decoration: none;
  }
`;

const NavBarLink = styled(Link)`
  padding: 0.8rem 0.4rem;
  color: #c8cfef;
  text-decoration: none;
`;

type Props = {
  ...QueryProps,
  isLogin: boolean,
  onLogout: () => mixed,
};

export class NavBar extends React.Component {
  props: Props;

  _handleLogoutButtonClick = () => {
    this.props.onLogout();
  };

  render() {
    const { isLogin } = this.props;

    return (
      <NavBarWrapper>
        <NavBarLink to="/">Dashboard</NavBarLink>
        <NavBarLink to="/daily/schedule">DailySchedule</NavBarLink>
        <NavBarLink to="/daily/report">DailyReport</NavBarLink>
        <NavBarLink to="/projects">Projects</NavBarLink>
        <NavBarLink to="/taskSets">TaskSets</NavBarLink>
        <NavBarLink to="/options">Options</NavBarLink>
        <NavBarLink to="/profile">Profile</NavBarLink>
        <NavBarLink to="/dailyReportTemplate">DailyReportTemplate</NavBarLink>
        {isLogin &&
          <NavBarItem>
            <Button onClick={this._handleLogoutButtonClick}>Logout</Button>
          </NavBarItem>}
      </NavBarWrapper>
    );
  }
}

const withData: OperationComponent<NavBarQuery, {}, Props> = compose(
  graphql(navBarQuery, {
    props: ({ data }) => ({
      isLogin: data && data.viewer,
    }),
  }),
  withApollo,
  graphql(LogoutMutationString, {
    props: ({ data, mutate, ownProps: { client } }) => ({
      onLogout: async () => {
        await LogoutMutation.commit(mutate);
        await client.resetStore();
      },
    }),
  }),
);

export default withData(NavBar);
