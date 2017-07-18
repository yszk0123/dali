import React from 'react';
import { Link } from 'react-router-dom';
import { createFragmentContainer, graphql } from 'react-relay';
import LogoutMutation from '../../graphql/mutations/LogoutMutation';
import Button from './Button';

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
      <ul>
        <li>
          <Link to="/">Dashboard</Link>
        </li>
        <li>
          <Link to="/daily/schedule">DailySchedule</Link>
        </li>
        <li>
          <Link to="/daily/report">DailyReport</Link>
        </li>
        <li>
          <Link to="/projects">Projects</Link>
        </li>
        <li>
          <Link to="/taskSets">TaskSets</Link>
        </li>
        <li>
          <Link to="/options">Options</Link>
        </li>
        <li>
          <Link to="/profile">Profile</Link>
        </li>
        <li>
          <Link to="/dailyReportTemplate">DailyReportTemplate</Link>
        </li>
        {viewer &&
          <li>
            <Button onClick={this._handleLogoutButtonClick}>Logout</Button>
          </li>}
      </ul>
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
