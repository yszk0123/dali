import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { createFragmentContainer, graphql } from 'react-relay';
import LogoutMutation from '../../graphql/mutations/LogoutMutation';
import Button from './Button';

const NavBarWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 0.8rem 0.2rem 0.3rem;
  overflow-x: scroll;
  background: #112ca5;
`;

const NavBarItem = styled.div`
  align-content: center;
  padding: 0.5rem;

  a {
    color: #c8cfef;
    text-decoration: none;
  }
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
        <NavBarItem>
          <Link to="/">Dashboard</Link>
        </NavBarItem>
        <NavBarItem>
          <Link to="/daily/schedule">DailySchedule</Link>
        </NavBarItem>
        <NavBarItem>
          <Link to="/daily/report">DailyReport</Link>
        </NavBarItem>
        <NavBarItem>
          <Link to="/projects">Projects</Link>
        </NavBarItem>
        <NavBarItem>
          <Link to="/taskSets">TaskSets</Link>
        </NavBarItem>
        <NavBarItem>
          <Link to="/options">Options</Link>
        </NavBarItem>
        <NavBarItem>
          <Link to="/profile">Profile</Link>
        </NavBarItem>
        <NavBarItem>
          <Link to="/dailyReportTemplate">DailyReportTemplate</Link>
        </NavBarItem>
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
