import * as React from 'react';
import { Link } from 'react-router-dom';
import { graphql, compose, withApollo, QueryProps } from 'react-apollo';
import { NavBarQuery } from 'schema';
import * as LogoutMutation from '../../graphql/mutations/LogoutMutation';
import * as navBarQuery from '../../graphql/querySchema/NavBar.graphql';
import styled from '../styles/StyledComponents';
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
  padding: 0.4rem 0.2rem;

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
      <NavBarLink to="/project">Project</NavBarLink>
      <NavBarLink to="/phase">Phase</NavBarLink>
      <NavBarLink to="/timeUnit">TimeUnit</NavBarLink>
      <NavBarLink to="/report">Report</NavBarLink>
      <NavBarLink to="/options">Options</NavBarLink>
      <NavBarLink to="/profile">Profile</NavBarLink>
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
        mutate && (await mutate(LogoutMutation.buildMutationOptions()));
        await client.resetStore();
      },
    }),
  }),
);

export default withData(NavBar);
