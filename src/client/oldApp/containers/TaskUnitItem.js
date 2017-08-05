import React from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import { DragSource } from 'react-dnd';
import RemoveTaskUnitMutation from '../../graphql/mutations/RemoveTaskUnitMutation';
import UpdateTaskUnitMutation from '../../graphql/mutations/UpdateTaskUnitMutation';
import MoveTaskUnitMutation from '../../graphql/mutations/MoveTaskUnitMutation';
import ItemTypes from '../constants/ItemTypes';
import TaskLabel from '../components/TaskLabel';

export class TaskUnitItem extends React.Component {
  _handleRemoveButtonClick = () => {
    this._removeTaskUnit();
  };

  _handleLabelClick = () => {
    this._toggleTaskUnitDone();
  };

  _toggleTaskUnitDone() {
    const { relay, taskUnit, timeUnit, dailySchedule } = this.props;

    UpdateTaskUnitMutation.commit(
      relay.environment,
      { done: !taskUnit.done },
      taskUnit,
      timeUnit,
      dailySchedule,
    );
  }

  _removeTaskUnit() {
    const { relay, taskUnit, timeUnit, dailySchedule } = this.props;

    RemoveTaskUnitMutation.commit(
      relay.environment,
      taskUnit,
      timeUnit,
      dailySchedule,
    );
  }

  render() {
    const { taskUnit, isDragging, connectDragSource } = this.props;

    return connectDragSource(
      <span style={{ opacity: isDragging ? 0.5 : 1 }}>
        <TaskLabel
          icon="times-circle"
          label={taskUnit.taskSet.title}
          done={taskUnit.done}
          onLabelClick={this._handleLabelClick}
          onRemoveButtonClick={this._handleRemoveButtonClick}
        />
      </span>,
    );
  }
}

const taskUnitSource = {
  beginDrag: ({ timeUnit, taskUnit }) => ({
    fromTimeUnitId: timeUnit.id,
    taskUnitId: taskUnit.id,
    taskSetId: taskUnit.taskSet.id,
  }),
  endDrag: ({ relay, timeUnit, taskUnit, dailySchedule }, monitor) => {
    if (!monitor.didDrop()) {
      return;
    }

    const { canMove, toTimeUnitId } = monitor.getDropResult();
    if (!canMove) {
      return;
    }

    MoveTaskUnitMutation.commit(
      relay.environment,
      taskUnit,
      timeUnit,
      { id: toTimeUnitId },
      dailySchedule,
    );
  },
};

export default createFragmentContainer(
  DragSource(ItemTypes.TASK_UNIT, taskUnitSource, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
  }))(TaskUnitItem),
  graphql.experimental`
    fragment TaskUnitItem_taskUnit on TaskUnit {
      id
      done
      taskSet {
        id
        title
      }
    }

    fragment TaskUnitItem_timeUnit on TimeUnit {
      id
    }

    fragment TaskUnitItem_dailySchedule on DailySchedule {
      id
    }

    fragment TaskUnitItem_viewer on User {
      id
    }
  `,
);
