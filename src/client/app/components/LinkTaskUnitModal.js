/* @flow */
import React from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import Modal from 'react-modal';
import LinkTaskUnitMutation from '../../graphql/mutations/LinkTaskUnitMutation';
import getNodesFromConnection from '../../shared/utils/getNodesFromConnection';
import type { TaskUnitModal_dailySchedule } from './__generated__/TaskUnitModal_dailySchedule.graphql';
import type { TaskUnitModal_timeUnit } from './__generated__/TaskUnitModal_timeUnit.graphql';
import type { TaskUnitModal_viewer } from './__generated__/TaskUnitModal_viewer.graphql';

type Props = {
  dailySchedule: TaskUnitModal_dailySchedule,
  isOpen: boolean,
  onClose: () => mixed,
  relay: any,
  timeUnit: TaskUnitModal_timeUnit,
  viewer: TaskUnitModal_viewer,
};

export class TaskUnitModal extends React.Component {
  props: Props;

  _add(taskUnit) {
    const { relay, timeUnit, dailySchedule, onClose } = this.props;

    LinkTaskUnitMutation.commit(
      relay.environment,
      taskUnit,
      timeUnit,
      dailySchedule,
    );

    onClose();
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
    const { isOpen, onClose } = this.props;

    return (
      <Modal contentLabel="modal" isOpen={isOpen} onRequestClose={onClose}>
        <h2>TaskUnits</h2>
        <ul>
          {this._renderTaskUnits()}
        </ul>
      </Modal>
    );
  }
}

export default createFragmentContainer(
  TaskUnitModal,
  graphql`
    fragment LinkTaskUnitModal_timeUnit on TimeUnit {
      id
    }

    fragment LinkTaskUnitModal_dailySchedule on DailySchedule {
      id
    }

    fragment LinkTaskUnitModal_viewer on User {
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
