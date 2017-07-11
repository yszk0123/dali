/* @flow */
import React from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import Modal from 'react-modal';
import AddTaskUnitMutation from '../../graphql/mutations/AddTaskUnitMutation';
import getNodesFromConnection from '../../shared/utils/getNodesFromConnection';
import type { TaskSetModal_dailySchedule } from './__generated__/TaskSetModal_dailySchedule.graphql';
import type { TaskSetModal_timeUnit } from './__generated__/TaskSetModal_timeUnit.graphql';
import type { TaskSetModal_viewer } from './__generated__/TaskSetModal_viewer.graphql';

type Props = {
  dailySchedule: TaskSetModal_dailySchedule,
  isOpen: boolean,
  onClose: () => mixed,
  relay: any,
  timeUnit: TaskSetModal_timeUnit,
  viewer: TaskSetModal_viewer,
};

export class TaskSetModal extends React.Component {
  props: Props;

  _add(taskSet) {
    const { relay, timeUnit, dailySchedule, onClose } = this.props;

    AddTaskUnitMutation.commit(
      relay.environment,
      taskSet,
      timeUnit,
      dailySchedule,
    );

    onClose();
  }

  _renderTaskSets() {
    const { viewer } = this.props;
    const taskSets = getNodesFromConnection(viewer.taskSets);

    return taskSets.map(taskSet =>
      <li key={taskSet.id}>
        <div>
          {taskSet.title}
        </div>
        <button onClick={() => this._add(taskSet)}>Add This</button>
      </li>,
    );
  }

  render() {
    const { isOpen, onClose } = this.props;

    return (
      <Modal contentLabel="modal" isOpen={isOpen} onRequestClose={onClose}>
        <h2>TaskSets</h2>
        <ul>
          {this._renderTaskSets()}
        </ul>
      </Modal>
    );
  }
}

export default createFragmentContainer(
  TaskSetModal,
  graphql.experimental`
    fragment AddTaskUnitModal_timeUnit on TimeUnit {
      id
    }

    fragment AddTaskUnitModal_dailySchedule on DailySchedule {
      id
    }

    fragment AddTaskUnitModal_viewer on User
      @argumentDefinitions(count: { type: "Int", defaultValue: 100 }) {
      taskSets(first: $count) @connection(key: "AddTaskUnitModal_taskSets") {
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
