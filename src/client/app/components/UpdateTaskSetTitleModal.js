/* @flow */
import React from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import UpdateTaskSetMutation from '../../graphql/mutations/UpdateTaskSetMutation';
import UpdateTitleModal from './UpdateTitleModal';

type Props = {
  relay: any,
  taskSet: any,
};

export class UpdateTaskSetTitleModal extends React.Component {
  props: Props;

  _handleTitleSubmit = ({ title }) => {
    const { relay, taskSet, onRequestClose } = this.props;

    UpdateTaskSetMutation.commit(relay.environment, { title }, taskSet);

    onRequestClose();
  };

  render() {
    const { isOpen, taskSet, onRequestClose } = this.props;

    return (
      <UpdateTitleModal
        isOpen={isOpen}
        title={taskSet.title}
        onRequestClose={onRequestClose}
        onSubmit={this._handleTitleSubmit}
      />
    );
  }
}

export default createFragmentContainer(
  UpdateTaskSetTitleModal,
  graphql.experimental`
    fragment UpdateTaskSetTitleModal_taskSet on TaskSet {
      id
      title
    }
  `,
);
