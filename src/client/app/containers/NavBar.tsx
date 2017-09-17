import * as React from 'react';
import { Link } from 'react-router-dom';
import { graphql, compose, withApollo, QueryProps } from 'react-apollo';
import { NavBarQuery } from 'schema';
import { Logout } from '../mutations';
import * as NAV_BAR_QUERY from '../querySchema/NavBar.graphql';
import { styled, ThemedProps } from '../../shared/styles';
import { Button, Icon, DropDownMenu } from '../../shared/components';

const DROPDOWN_Z_INDEX = 999;

const NavBarWrapper = styled.div`
  display: flex;
  position: fixed;
  top: 0;
  padding: 0 1.6rem;
  justify-content: space-between;
  align-items: center;
  width: 100%;
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

const DropDownLink = styled(Link)`
  padding: 0.8rem 0.4rem;
  color: ${({ theme }) => theme.dropDown.default.color};
  text-decoration: none;
`;

interface OwnProps {}

type Props = Response &
  NavBarQuery &
  QueryProps &
  OwnProps & {
    height: number;
    isLogin: boolean;
    onLogout(): void;
  };

interface State {
  isOpen: boolean;
}

export class NavBar extends React.Component<Props, State> {
  state = { isOpen: false };

  private handleToggle = () => {
    const { isOpen } = this.state;

    this.setState({ isOpen: !isOpen });
  };

  private handleClose = () => {
    this.setState({ isOpen: false });
  };

  render() {
    const { height, isLogin, onLogout } = this.props;
    const { isOpen } = this.state;

    return (
      <NavBarWrapper style={{ height }}>
        <NavBarLink to="/groups">GROUP</NavBarLink>
        <NavBarLink to="/projects">PROJECT</NavBarLink>
        <NavBarLink to="/timeUnits">TIMEUNIT</NavBarLink>
        <NavBarLink to="/report">REPORT</NavBarLink>
        <DropDownMenu
          isOpen={isOpen}
          zIndex={DROPDOWN_Z_INDEX}
          toggleElement={<Icon icon="bars" onClick={this.handleToggle} />}
          onClick={this.handleClose}
        >
          <DropDownLink to="/phases">
            <Icon icon="tasks" /> Phases
          </DropDownLink>
          <DropDownLink to="/settings">
            <Icon icon="cog" /> Settings
          </DropDownLink>
          <DropDownLink to="/profile">
            <Icon icon="user" /> Profile
          </DropDownLink>
          {isLogin && <NavBarButton onClick={onLogout}>Logout</NavBarButton>}
        </DropDownMenu>
      </NavBarWrapper>
    );
  }
}

const withData = compose(
  graphql<Response & NavBarQuery, OwnProps, Props>(NAV_BAR_QUERY, {
    props: ({ data }) => ({
      isLogin: data && data.currentUser,
    }),
  }),
  withApollo,
  graphql<Response, { client: any }, Props>(Logout.mutation, {
    props: ({ data, mutate, ownProps: { client } }) => ({
      onLogout: async () => {
        mutate && (await mutate(Logout.build()));
        await client.resetStore();
      },
    }),
  }),
);

export default withData(NavBar);
