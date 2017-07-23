import React from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import CreateDailyScheduleMutation from '../../graphql/mutations/CreateDailyScheduleMutation';
import AddTaskUnitModal from './AddTaskUnitModal';
import Button from './Button';
import Day from './Day';
import TimeUnitList from './TimeUnitList';

function CreateDailyScheduleButton({ onClick }) {
  return <Button onClick={onClick}>Create Daily Schedule</Button>;
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
        <div style={{ textAlign: 'center', width: '100%' }}>
          <h2>TimeUnits</h2>
          <h1>
            <Day date={viewer.dailySchedule.date} />
          </h1>
        </div>
        <TimeUnitList viewer={viewer} dailySchedule={viewer.dailySchedule} />
        <AddTaskUnitModal
          dailySchedule={viewer.dailySchedule}
          viewer={viewer}
        />
      </div>
    );
  }
}

export default createFragmentContainer(
  DailySchedulePage,
  graphql.experimental`
    fragment DailySchedulePage_viewer on User
      @argumentDefinitions(date: { type: "Date!" }) {
      dailySchedule(date: $date) {
        date
        ...AddTaskUnitModal_dailySchedule
        ...TimeUnitList_dailySchedule
      }
      ...AddTaskUnitModal_viewer
      ...TimeUnitList_viewer
    }
  `,
);
