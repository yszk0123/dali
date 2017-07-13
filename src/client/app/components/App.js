/* @flow */
import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import styled from 'styled-components';
import { createRefetchContainer, graphql } from 'react-relay';
import PropsRoute from '../../shared/components/PropsRoute';
import { startOfDay } from '../../../server/shared/utils/DateUtils';
import type { App_viewer } from './__generated__/App_viewer.graphql';
import DailyReportPage from './DailyReportPage';
import DashboardPage from './DashboardPage';
import ProjectsPage from './ProjectsPage';
import DailySchedulePage from './DailySchedulePage';
import WorkspacePage from './WorkspacePage';

const Wrapper = styled.div`padding: 1.5rem;`;

type Props = { viewer: App_viewer };

type State = { currentDate: Date };

// TODO: Extract into other file
function previousDay(date) {
  return startOfDay(new Date(date.getTime() - 24 * 60 * 60 * 1000));
}

// TODO: Extract into other file
function nextDay(date) {
  return startOfDay(new Date(date.getTime() + 24 * 60 * 60 * 1000));
}

export class App extends React.Component {
  props: Props;
  state: State;

  constructor(props: Props) {
    super(props);
    this.state = {
      currentDate: startOfDay(new Date()),
    };
  }

  _handleGoToPreviousDayClick = () => {
    this._goToPreviousDay();
  };

  _handleGoToNextDayClick = () => {
    this._goToNextDay();
  };

  _goToPreviousDay() {
    const { relay } = this.props;

    this.setState(
      ({ currentDate }) => ({ currentDate: previousDay(currentDate) }),
      () => {
        const { currentDate } = this.state;
        const refetchVariables = () => ({ date: currentDate });

        relay.refetch(refetchVariables, null);
      },
    );
  }

  _goToNextDay() {
    const { relay } = this.props;

    this.setState(
      ({ currentDate }) => ({ currentDate: nextDay(currentDate) }),
      () => {
        const { currentDate } = this.state;
        const refetchVariables = () => ({ date: currentDate });

        relay.refetch(refetchVariables, null);
      },
    );
  }

  render() {
    const { viewer } = this.props;
    const { currentDate } = this.state;

    return (
      <Wrapper>
        <ul>
          <li>
            <Link to="/">Dashboard</Link>
          </li>
          <li>
            <Link to="/dailySchedule">DailySchedule</Link>
          </li>
          <li>
            <Link to="/projects">Projects</Link>
          </li>
          <li>
            <Link to="/workspace">Workspace</Link>
          </li>
          <li>
            <Link to="/dailyReport">DailyReport</Link>
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
        </ul>
        <button onClick={this._handleGoToPreviousDayClick}>Previous Day</button>
        <button onClick={this._handleGoToNextDayClick}>Next Day</button>
        <PropsRoute exact path="/" component={DashboardPage} viewer={viewer} />
        <PropsRoute
          path="/dailySchedule"
          component={DailySchedulePage}
          defaultDate={currentDate}
          viewer={viewer}
        />
        <PropsRoute path="/projects" component={ProjectsPage} viewer={viewer} />
        <PropsRoute
          path="/workspace"
          component={WorkspacePage}
          viewer={viewer}
        />
        <PropsRoute
          path="/dailyReport"
          component={DailyReportPage}
          viewer={viewer}
        />
      </Wrapper>
    );
  }
}

export default withRouter(
  createRefetchContainer(
    App,
    graphql.experimental`
      fragment App_viewer on User @argumentDefinitions(date: { type: "Date" }) {
        id
        ...DailyReportPage_viewer @arguments(date: $date)
        ...ProjectsPage_viewer
        ...DailySchedulePage_viewer @arguments(date: $date)
        ...WorkspacePage_viewer
      }
    `,
    graphql.experimental`
      query AppRefetchQuery($date: Date) {
        viewer {
          ...App_viewer @arguments(date: $date)
        }
      }
    `,
  ),
);
