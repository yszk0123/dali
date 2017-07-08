/* @flow */
import React from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import AddTaskUnitMutation from '../../graphql/mutations/AddTaskUnitMutation';
import getNodesFromConnection from '../../shared/utils/getNodesFromConnection';
import type { TaskUnitModal_dailySchedule } from './__generated__/TaskUnitModal_dailySchedule.graphql';
import type { TaskUnitModal_timeUnit } from './__generated__/TaskUnitModal_timeUnit.graphql';
import type { TaskUnitModal_viewer } from './__generated__/TaskUnitModal_viewer.graphql';

type Props = {
  relay: any,
  dailySchedule: TaskUnitModal_dailySchedule,
  timeUnit: TaskUnitModal_timeUnit,
  viewer: TaskUnitModal_viewer,
};

export class TaskUnitModal extends React.Component {
  props: Props;

  _add(taskUnit) {
    const { relay, timeUnit, dailySchedule } = this.props;

    AddTaskUnitMutation.commit(
      relay.environment,
      taskUnit,
      timeUnit,
      dailySchedule,
    );
  }

  _renderTaskUnits() {
    const { viewer } = this.props;
    const taskUnits = getNodesFromConnection(viewer.taskUnits);

    return taskUnits.map(taskUnit =>
      <li key={taskUnit.id}>
        <div>
          {taskUnit.title}
        </div>
        <button onClick={() => this._add(taskUnit)}>Add This</button>
      </li>,
    );
  }

  render() {
    return (
      <div>
        <h2>TaskUnits</h2>
        <ul>
          {this._renderTaskUnits()}
        </ul>
      </div>
    );
  }
}

export default createFragmentContainer(
  TaskUnitModal,
  graphql`
    fragment TaskUnitModal_timeUnit on TimeUnit {
      id
    }

    fragment TaskUnitModal_viewer on User {
      taskUnits(first: 100) {
        edges {
          node {
            id
            title
          }
        }
      }
    }
  `,
);
