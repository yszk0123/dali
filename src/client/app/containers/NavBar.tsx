import * as React from 'react';
import { Link } from 'react-router-dom';
import { graphql, compose, withApollo, QueryProps } from 'react-apollo';
import { NavBarQuery } from 'schema';
import * as LogoutMutation from '../../graphql/mutations/LogoutMutation';
import * as navBarQuery from '../../graphql/querySchema/NavBar.graphql';
import styled from '../styles/StyledComponents';
import Button from '../components/Button';
import Icon from '../components/Icon';

const NavBarWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 0.6rem 1.2rem;
  overflow-x: scroll;
  background: #112ca5;
  font-size: 1.4rem;
`;

const NavBarButton = styled(Button)`
  padding: 0.4rem 0.2rem;

  a {
    color: ${({ theme }) => theme.navBar.default.color};
    text-decoration: none;
  }
`;

const NavBarLink = styled(Link)`
  padding: 0.8rem 0.4rem;
  color: ${({ theme }) => theme.navBar.default.color};
  text-decoration: none;
`;

// TODO: Implement
interface DropdownProps {}

function Dropdown(props: DropdownProps) {
  return <Icon icon="bars" />;
}

interface NavBarProps {
  isLogin: boolean;
  onLogout(): void;
}

type Props = Response & NavBarQuery & QueryProps & NavBarProps;

export function NavBar({ isLogin, onLogout }: Props) {
  return (
    <NavBarWrapper>
      <NavBarLink to="/">
        <Icon icon="home" />
      </NavBarLink>
      <NavBarLink to="/project">
        <Icon icon="tags" />
      </NavBarLink>
      <NavBarLink to="/phase">
        <Icon icon="tasks" />
      </NavBarLink>
      <NavBarLink to="/timeUnit">
        <Icon icon="calendar" />
      </NavBarLink>
      <NavBarLink to="/report">
        <Icon icon="file-text" />
      </NavBarLink>
      {isLogin && <NavBarButton onClick={onLogout}>Logout</NavBarButton>}
      <Dropdown>
        <NavBarLink to="/options">Options</NavBarLink>
        <NavBarLink to="/profile">Profile</NavBarLink>
      </Dropdown>
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
