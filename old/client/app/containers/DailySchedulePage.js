import * as React from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import CreateDailyScheduleMutation from '../../graphql/mutations/CreateDailyScheduleMutation';
import Button from '../components/Button';
import Day from '../components/Day';
import AddTaskUnitModal from './AddTaskUnitModal';
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
        <h2 style={{ textAlign: 'center', width: '100%' }}>
          <Day date={viewer.dailySchedule.date} />
        </h2>
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
