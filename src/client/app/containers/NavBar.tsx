import * as React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { graphql, compose, withApollo, QueryProps } from 'react-apollo';
import { NavBarQuery } from 'schema';
import * as LogoutMutation from '../../graphql/mutations/LogoutMutation';
import * as navBarQuery from '../../graphql/querySchema/NavBar.graphql';
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

interface NavBarProps {
  isLogin: boolean;
  onLogout(): void;
}

type Props = Response & NavBarQuery & QueryProps & NavBarProps;

export function NavBar({ isLogin, onLogout }: Props) {
  return (
    <NavBarWrapper>
      <NavBarLink to="/">Dashboard</NavBarLink>
      <NavBarLink to="/schedule">Schedule</NavBarLink>
      <NavBarLink to="/daily/report">DailyReport</NavBarLink>
      <NavBarLink to="/projects">Projects</NavBarLink>
      <NavBarLink to="/taskSets">TaskSets</NavBarLink>
      <NavBarLink to="/options">Options</NavBarLink>
      <NavBarLink to="/profile">Profile</NavBarLink>
      <NavBarLink to="/dailyReportTemplate">DailyReportTemplate</NavBarLink>
      {isLogin &&
        <NavBarItem>
          <Button onClick={onLogout}>Logout</Button>
        </NavBarItem>}
    </NavBarWrapper>
  );
}

const withData = compose(
  graphql<Response & NavBarQuery, {}, Response & QueryProps>(navBarQuery, {
    props: ({ data }) => ({
      isLogin: data && data.currentUser,
    }),
  }),
  withApollo,
  graphql<Response, { client: any }, Props>(LogoutMutation.mutation, {
    props: ({ data, mutate, ownProps: { client } }) => ({
      onLogout: async () => {
        await mutate(LogoutMutation.buildMutationOptions());
        await client.resetStore();
      },
    }),
  }),
);

export default withData(NavBar);
