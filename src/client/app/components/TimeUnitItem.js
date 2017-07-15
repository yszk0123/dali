import React from 'react';
import styled from 'styled-components';
import { createFragmentContainer, graphql } from 'react-relay';
import getNodesFromConnection from '../../shared/utils/getNodesFromConnection';
import RemoveTaskUnitMutation from '../../graphql/mutations/RemoveTaskUnitMutation';
import RemoveTimeUnitMutation from '../../graphql/mutations/RemoveTimeUnitMutation';
import AddTaskUnitModal from './AddTaskUnitModal';
import Card from './Card';
import IconButton from './IconButton';
import IconButtonGroup from './IconButtonGroup';
import UpdateTimeUnitTitleModal from './UpdateTimeUnitTitleModal';

const Tag = styled.span`
  display: inline-block;
  margin: 2px;
`;

const TagList = styled.div`
  margin: 2px;
  padding: 0.3rem;
`;

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
    <TagList>
      {taskUnits.map(taskUnit =>
        <Tag key={taskUnit.id} onClick={() => onTaskUnitClick(taskUnit)}>
          {taskUnit.taskSet.title}
        </Tag>,
      )}
    </TagList>
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
  return <IconButton icon="plus" label="TaskUnit" onClick={onClick} />;
}

export function UpdateTitleButton({ onClick }) {
  return <IconButton icon="edit" label="Update Title" onClick={onClick} />;
}

function RemoveButton({ onClick }) {
  return <IconButton icon="trash" label="Remove TimeUnit" onClick={onClick} />;
}

export class TimeUnitItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isAddTaskUnitModalOpen: false,
      isUpdateTitleModalOpen: false,
    };
  }

  _handleAddTaskUnitButtonClick = event => {
    this.setState({ isAddTaskUnitModalOpen: true });
  };

  _handleUpdateTitleButtonClick = event => {
    this.setState({ isUpdateTitleModalOpen: true });
  };

  _handleModalClose = () => {
    this.setState({
      isAddTaskUnitModalOpen: false,
      isUpdateTitleModalOpen: false,
    });
  };

  _handleRemoveButtonClick = () => {
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
    const { isAddTaskUnitModalOpen, isUpdateTitleModalOpen } = this.state;
    const taskUnits = getNodesFromConnection(timeUnit.taskUnits);

    return (
      <Card
        title={
          <div>
            <TimeRange position={timeUnit.position} />
            {timeUnit.title}
          </div>
        }
      >
        <TaskSummary
          taskUnits={taskUnits}
          onTaskUnitClick={this._handleTaskUnitClick}
        />
        <IconButtonGroup>
          <AddTaskUnitButton onClick={this._handleAddTaskUnitButtonClick} />
          <UpdateTitleButton onClick={this._handleUpdateTitleButtonClick} />
          <RemoveButton onClick={this._handleRemoveButtonClick} />
        </IconButtonGroup>
        <AddTaskUnitModal
          dailySchedule={dailySchedule}
          isOpen={isAddTaskUnitModalOpen}
          onRequestClose={this._handleModalClose}
          timeUnit={timeUnit}
          viewer={viewer}
        />
        <UpdateTimeUnitTitleModal
          dailySchedule={dailySchedule}
          isOpen={isUpdateTitleModalOpen}
          onRequestClose={this._handleModalClose}
          timeUnit={timeUnit}
        />
      </Card>
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
