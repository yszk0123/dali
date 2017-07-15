/* @flow */
import React from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import UpdateTimeUnitMutation from '../../graphql/mutations/UpdateTimeUnitMutation';
import UpdateTitleModal from './UpdateTitleModal';

type Props = {
  dailySchedule: any,
  relay: any,
  timeUnit: any,
};

export class UpdateTimeUnitTitleModal extends React.Component {
  props: Props;

  _handleTitleSubmit = ({ title }) => {
    const { relay, timeUnit, dailySchedule, onRequestClose } = this.props;

    UpdateTimeUnitMutation.commit(
      relay.environment,
      { title },
      timeUnit,
      dailySchedule,
    );

    onRequestClose();
  };

  render() {
    const { isOpen, timeUnit, onRequestClose } = this.props;

    return (
      <UpdateTitleModal
        isOpen={isOpen}
        title={timeUnit.title}
        onRequestClose={onRequestClose}
        onSubmit={this._handleTitleSubmit}
      />
    );
  }
}

export default createFragmentContainer(
  UpdateTimeUnitTitleModal,
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
