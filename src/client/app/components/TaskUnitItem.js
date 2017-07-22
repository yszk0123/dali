import React from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import RemoveTaskUnitMutation from '../../graphql/mutations/RemoveTaskUnitMutation';
import UpdateTaskUnitMutation from '../../graphql/mutations/UpdateTaskUnitMutation';
import IconButton from './IconButton';

export class TaskUnitItem extends React.Component {
  _handleTaskUnitClick = () => {
    this._removeTaskUnit();
  };

  _handleTaskUnitDoneChange = () => {
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
    const { taskUnit } = this.props;

    return (
      <span>
        <input
          type="checkbox"
          checked={taskUnit.done}
          onChange={this._handleTaskUnitDoneChange}
        />
        <IconButton
          icon="times-circle"
          label={taskUnit.taskSet.title}
          onIconClick={this._handleTaskUnitClick}
        />
      </span>
    );
  }
}

export default createFragmentContainer(
  TaskUnitItem,
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
