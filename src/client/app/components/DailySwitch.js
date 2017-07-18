/* @flow */
import React from 'react';
import { createRefetchContainer, graphql } from 'react-relay';
import { Switch, withRouter } from 'react-router-dom';
import { subDays, addDays } from 'date-fns';
import toDaliDate from '../../../shared/utils/toDaliDate';
import PropsPrivateRoute from '../../shared/components/PropsPrivateRoute';
import Button from './Button';
import DailySchedulePage from './DailySchedulePage';
import DailyReportPage from './DailyReportPage';

type Props = { viewer: any };

type State = { currentDate: Date };

export class DailySwitch extends React.Component {
  props: Props;
  state: State;

  constructor(props: Props) {
    super(props);
    this.state = {
      currentDate: toDaliDate(new Date()),
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
      ({ currentDate }) => ({ currentDate: subDays(currentDate, 1) }),
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
      ({ currentDate }) => ({ currentDate: addDays(currentDate, 1) }),
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
        <Button onClick={this._handleGoToPreviousDayClick}>Previous Day</Button>
        <Button onClick={this._handleGoToNextDayClick}>Next Day</Button>
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
            defaultDate={currentDate}
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
        @argumentDefinitions(date: { type: "Date!" }) {
        id
        ...DailyReportPage_viewer @arguments(date: $date)
        ...DailySchedulePage_viewer @arguments(date: $date)
      }
    `,
    graphql.experimental`
      query DailySwitchRefetchQuery($date: Date!) {
        viewer {
          ...DailySwitch_viewer @arguments(date: $date)
        }
      }
    `,
  ),
);
