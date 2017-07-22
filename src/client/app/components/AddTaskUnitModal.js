/* @flow */
import React from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import { connect } from 'react-redux';
import Modal from 'react-modal';
import AddTaskUnitMutation from '../../graphql/mutations/AddTaskUnitMutation';
import closeAddTaskUnitModal from '../../redux/actions/closeAddTaskUnitModal';
import getNodesFromConnection from '../../shared/utils/getNodesFromConnection';
import Icon from './Icon';

type Props = {
  dailySchedule: any,
  isOpen: boolean,
  onRequestClose: () => mixed,
  relay: any,
  timeUnitId: any,
  viewer: any,
};

export class TaskSetModal extends React.Component {
  props: Props;

  _add(taskSet) {
    const { relay, timeUnitId, dailySchedule, onRequestClose } = this.props;

    AddTaskUnitMutation.commit(
      relay.environment,
      taskSet,
      { id: timeUnitId },
      dailySchedule,
    );

    onRequestClose();
  }

  _renderTaskSets() {
    const { viewer } = this.props;
    const taskSets = getNodesFromConnection(viewer.taskSets);

    return taskSets.map(taskSet =>
      <li key={taskSet.id}>
        {taskSet.title} <Icon icon="plus" onClick={() => this._add(taskSet)} />
      </li>,
    );
  }

  render() {
    const { isOpen, onRequestClose } = this.props;

    return (
      <Modal
        contentLabel="modal"
        isOpen={isOpen}
        onRequestClose={onRequestClose}
      >
        <h2>TaskSets</h2>
        <ul>
          {this._renderTaskSets()}
        </ul>
      </Modal>
    );
  }
}

function mapStateToProps({ modals: { timeUnitId } }) {
  return {
    isOpen: timeUnitId != null,
    timeUnitId,
  };
}

const mapDispatchToProps = {
  onRequestClose: closeAddTaskUnitModal,
};

export default createFragmentContainer(
  connect(mapStateToProps, mapDispatchToProps)(TaskSetModal),
  graphql.experimental`
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
