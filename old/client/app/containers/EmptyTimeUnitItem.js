/**
 * TODO: Extract sharable components
 */
import React from 'react';
import styled from 'styled-components';
import { createFragmentContainer, graphql } from 'react-relay';
import CreateTimeUnitMutation from '../../graphql/mutations/CreateTimeUnitMutation';
import Icon from '../components/Icon';
import TimeLabel from '../components/TimeLabel';

const Wrapper = styled.div`
  color: #888;
  cursor: pointer;
`;

export class EmptyTimeUnitItem extends React.Component {
  _handleCreateTimeUnitButtonClick = event => {
    this._createTimeUnit();
  };

  _createTimeUnit() {
    const { relay, position, dailySchedule } = this.props;

    CreateTimeUnitMutation.commit(
      relay.environment,
      { position },
      dailySchedule,
    );
  }

  render() {
    const { position } = this.props;

    return (
      <Wrapper>
        <span onClick={this._handleCreateTimeUnitButtonClick}>
          <Icon icon="plus" /> <TimeLabel position={position} />
        </span>
      </Wrapper>
    );
  }
}

export default createFragmentContainer(
  EmptyTimeUnitItem,
  graphql`
    fragment EmptyTimeUnitItem_dailySchedule on DailySchedule {
      id
    }
  `,
);
