/* @flow */
import React from 'react';
import { createRefetchContainer, graphql } from 'react-relay';
import { Switch, withRouter } from 'react-router-dom';
import { startOfDay } from '../../../server/shared/utils/DateUtils';
import PropsPrivateRoute from '../../shared/components/PropsPrivateRoute';
import DailySchedulePage from './DailySchedulePage';
import DailyReportPage from './DailyReportPage';

// TODO: Extract into other file
function previousDay(date) {
  return startOfDay(new Date(date.getTime() - 24 * 60 * 60 * 1000));
}

// TODO: Extract into other file
function nextDay(date) {
  return startOfDay(new Date(date.getTime() + 24 * 60 * 60 * 1000));
}

type Props = { viewer: any };

type State = { currentDate: Date };

export class DailySwitch extends React.Component {
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
      <div>
        <button onClick={this._handleGoToPreviousDayClick}>Previous Day</button>
        <button onClick={this._handleGoToNextDayClick}>Next Day</button>
        <Switch>
          <PropsPrivateRoute
            path="/daily/schedule"
            component={DailySchedulePage}
            defaultDate={currentDate}
            viewer={viewer}
          />
          <PropsPrivateRoute
            path="/daily/report"
            component={DailyReportPage}
            viewer={viewer}
          />
        </Switch>
      </div>
    );
  }
}

export default withRouter(
  createRefetchContainer(
    DailySwitch,
    graphql.experimental`
      fragment DailySwitch_viewer on User
        @argumentDefinitions(date: { type: "Date" }) {
        id
        ...DailyReportPage_viewer @arguments(date: $date)
        ...DailySchedulePage_viewer @arguments(date: $date)
      }
    `,
    graphql.experimental`
      query DailySwitchRefetchQuery($date: Date) {
        viewer {
          ...DailySwitch_viewer @arguments(date: $date)
        }
      }
    `,
  ),
);
