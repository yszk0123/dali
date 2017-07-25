import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { createFragmentContainer, graphql } from 'react-relay';
import LogoutMutation from '../../graphql/mutations/LogoutMutation';
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

export class NavBar extends React.Component {
  _handleLogoutButtonClick = () => {
    this._logout();
  };

  _logout() {
    const { relay } = this.props;
    LogoutMutation.commit(relay.environment);
  }

  render() {
    const { viewer } = this.props;

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
        {viewer &&
          <NavBarItem>
            <Button onClick={this._handleLogoutButtonClick}>Logout</Button>
          </NavBarItem>}
      </NavBarWrapper>
    );
  }
}

export default createFragmentContainer(
  NavBar,
  graphql.experimental`
    fragment NavBar_viewer on User {
      id
    }
  `,
);
