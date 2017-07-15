import React from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import CreateDailyScheduleMutation from '../../graphql/mutations/CreateDailyScheduleMutation';
import TimeUnitList from './TimeUnitList';
import Day from './Day';

function CreateDailyScheduleButton({ onClick }) {
  return <button onClick={onClick}>Create Daily Schedule</button>;
}

export class DailySchedulePage extends React.Component {
  _handleCreateButtonClick = () => {
    const { viewer, relay, defaultDate } = this.props;

    CreateDailyScheduleMutation.commit(
      relay.environment,
      { date: defaultDate },
      viewer,
    );
  };

  render() {
    const { viewer, defaultDate } = this.props;

    if (!viewer.dailySchedule) {
      return (
        <div>
          <h2>
            <Day date={defaultDate} />
          </h2>
          <CreateDailyScheduleButton onClick={this._handleCreateButtonClick} />
        </div>
      );
    }

    return (
      <div>
        <h2>
          <Day date={viewer.dailySchedule.date} />
        </h2>
        <TimeUnitList viewer={viewer} dailySchedule={viewer.dailySchedule} />
      </div>
    );
  }
}

export default createFragmentContainer(
  DailySchedulePage,
  graphql.experimental`
    fragment DailySchedulePage_viewer on User
      @argumentDefinitions(date: { type: "Date" }) {
      dailySchedule(date: $date) {
        date
        ...TimeUnitList_dailySchedule
      }
      ...TimeUnitList_viewer
    }
  `,
);
