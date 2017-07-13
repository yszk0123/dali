import React from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import getNodesFromConnection from '../../shared/utils/getNodesFromConnection';
import RemoveTaskUnitMutation from '../../graphql/mutations/RemoveTaskUnitMutation';
import RemoveTimeUnitMutation from '../../graphql/mutations/RemoveTimeUnitMutation';
import AddTaskUnitModal from './AddTaskUnitModal';
import UpdateTimeUnitTitleModal from './UpdateTimeUnitTitleModal';

function mapPositionToTimeRange(position) {
  const odd = position % 2 === 0;
  const startHour = Math.floor(position / 2);
  const endHour = odd ? startHour : startHour + 1;
  const startMinute = odd ? '00' : '30';
  const endMinute = !odd ? '00' : '30';

  return `${startHour}:${startMinute}~${endHour}:${endMinute}`;
}

export function TaskSummary({ taskUnits, onTaskUnitClick }) {
  return (
    <div>
      {taskUnits.map(taskUnit =>
        <span key={taskUnit.id} onClick={() => onTaskUnitClick(taskUnit)}>
          {taskUnit.taskSet.title}
        </span>,
      )}
    </div>
  );
}

export function TimeRange({ position }) {
  return (
    <div>
      {mapPositionToTimeRange(position)}
    </div>
  );
}

export function AddTaskUnitButton({ onClick }) {
  return (
    <div>
      <button onClick={onClick}>Add TaskSet Here</button>
    </div>
  );
}

export function UpdateTimeUnitTitleButton({ onClick }) {
  return <button onClick={onClick}>Update Title</button>;
}

function RemoveTimeUnitButton({ onClick }) {
  return (
    <div>
      <button onClick={onClick}>Remove TimeUnit</button>
    </div>
  );
}

export class TimeUnitItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isAddTaskUnitModalOpen: false,
      isUpdateTimeUnitTitleModalOpen: false,
    };
  }

  _handleAddTaskUnitButtonClick = event => {
    this.setState({ isAddTaskUnitModalOpen: true });
  };

  _handleUpdateTimeUnitTitleButtonClick = event => {
    this.setState({ isUpdateTimeUnitTitleModalOpen: true });
  };

  _handleModalClose = () => {
    this.setState({
      isAddTaskUnitModalOpen: false,
      isUpdateTimeUnitTitleModalOpen: false,
    });
  };

  _handleRemoveTimeUnitButtonClick = () => {
    this._removeTimeUnit();
  };

  _handleTaskUnitClick = taskUnit => {
    this._removeTaskUnit(taskUnit);
  };

  _removeTimeUnit() {
    const { relay, timeUnit, dailySchedule } = this.props;

    RemoveTimeUnitMutation.commit(relay.environment, timeUnit, dailySchedule);
  }

  _removeTaskUnit(taskUnit) {
    const { relay, timeUnit, dailySchedule } = this.props;

    RemoveTaskUnitMutation.commit(
      relay.environment,
      taskUnit,
      timeUnit,
      dailySchedule,
    );
  }

  render() {
    const { timeUnit, viewer, dailySchedule } = this.props;
    const {
      isAddTaskUnitModalOpen,
      isUpdateTimeUnitTitleModalOpen,
    } = this.state;
    const taskUnits = getNodesFromConnection(timeUnit.taskUnits);

    return (
      <div>
        <h2>
          {timeUnit.title}
        </h2>
        <TaskSummary
          taskUnits={taskUnits}
          onTaskUnitClick={this._handleTaskUnitClick}
        />
        <AddTaskUnitButton onClick={this._handleAddTaskUnitButtonClick} />
        <UpdateTimeUnitTitleButton
          onClick={this._handleUpdateTimeUnitTitleButtonClick}
        />
        <TimeRange position={timeUnit.position} />
        <AddTaskUnitModal
          dailySchedule={dailySchedule}
          isOpen={isAddTaskUnitModalOpen}
          onRequestClose={this._handleModalClose}
          timeUnit={timeUnit}
          viewer={viewer}
        />
        <UpdateTimeUnitTitleModal
          dailySchedule={dailySchedule}
          isOpen={isUpdateTimeUnitTitleModalOpen}
          onRequestClose={this._handleModalClose}
          timeUnit={timeUnit}
        />
        <RemoveTimeUnitButton onClick={this._handleRemoveTimeUnitButtonClick} />
      </div>
    );
  }
}

export default createFragmentContainer(
  TimeUnitItem,
  graphql.experimental`
    fragment TimeUnitItem_timeUnit on TimeUnit
      @argumentDefinitions(count: { type: "Int", defaultValue: 100 }) {
      id
      title
      position
      taskUnits(first: $count) @connection(key: "TimeUnitItem_taskUnits") {
        edges {
          node {
            id
            taskSet {
              id
              title
            }
          }
        }
      }
      ...AddTaskUnitModal_timeUnit
      ...UpdateTimeUnitTitleModal_timeUnit
    }

    fragment TimeUnitItem_dailySchedule on DailySchedule {
      id
      ...AddTaskUnitModal_dailySchedule
      ...UpdateTimeUnitTitleModal_dailySchedule
    }

    fragment TimeUnitItem_viewer on User {
      ...AddTaskUnitModal_viewer
    }
  `,
);
