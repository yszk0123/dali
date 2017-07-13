/* @flow */
import React from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import Modal from 'react-modal';
import UpdateTimeUnitMutation from '../../graphql/mutations/UpdateTimeUnitMutation';

type Props = {
  dailySchedule: any,
  relay: any,
  timeUnit: any,
};

export class TaskSetModal extends React.Component {
  props: Props;

  constructor(props: Props) {
    super(props);
    this.state = {
      title: props.timeUnit.title || '',
    };
  }

  _handleTitleChange = event => {
    this.setState({
      title: event.target.value,
    });
  };

  _handleUpdateTitleButtonClick = () => {
    this._updateTitle();
  };

  _updateTitle() {
    const { relay, timeUnit, dailySchedule, onClose } = this.props;
    const { title } = this.state;

    if (!title) {
      return;
    }

    UpdateTimeUnitMutation.commit(
      relay.environment,
      { title },
      timeUnit,
      dailySchedule,
    );

    onClose();
  }

  render() {
    const { isOpen, onClose } = this.props;
    const { title } = this.state;

    return (
      <Modal contentLabel="modal" isOpen={isOpen} onRequestClose={onClose}>
        <h2>Title</h2>
        <input type="text" value={title} onChange={this._handleTitleChange} />
        <button onClick={this._handleUpdateTitleButtonClick}>OK</button>
      </Modal>
    );
  }
}

export default createFragmentContainer(
  TaskSetModal,
  graphql.experimental`
    fragment UpdateTimeUnitTitleModal_timeUnit on TimeUnit {
      id
      title
    }

    fragment UpdateTimeUnitTitleModal_dailySchedule on DailySchedule {
      id
    }
  `,
);
