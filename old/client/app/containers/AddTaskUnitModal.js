/* @flow */
import * as React from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import { connect } from 'react-redux';
import Modal from 'react-modal';
import AddTaskUnitMutation from '../../graphql/mutations/AddTaskUnitMutation';
import closeAddTaskUnitModal from '../../redux/actions/closeAddTaskUnitModal';
import getNodesFromConnection from '../../shared/utils/getNodesFromConnection';
import ModalTitle from '../components/ModalTitle';
import Icon from '../components/Icon';
import List from './List';
import ListItem from './ListItem';

interface Props {
  dailySchedule: any,
  isOpen: boolean,
  onRequestClose: () => mixed,
  relay: any,
  timeUnitId: any,
  viewer: any,
}

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
      <ListItem key={taskSet.id} onClick={() => this._add(taskSet)}>
        <Icon icon="plus" /> {taskSet.title}
      </ListItem>,
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
        <ModalTitle>Select TaskSet To Add</ModalTitle>
        <List>
          {this._renderTaskSets()}
        </List>
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
      @argumentDefinitions(
        count: { type: "Int", defaultValue: 100 }
        done: { type: "Boolean", defaultValue: false }
      ) {
      taskSets(first: $count, done: $done)
        @connection(key: "AddTaskUnitModal_taskSets") {
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
