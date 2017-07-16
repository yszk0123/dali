/**
 * TODO: Extract sharable components
 */
import React from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import CreateTimeUnitMutation from '../../graphql/mutations/CreateTimeUnitMutation';
import Card from './Card';
import IconButton from './IconButton';
import IconButtonGroup from './IconButtonGroup';

function mapPositionToTimeRange(position) {
  const odd = position % 2 === 0;
  const startHour = Math.floor(position / 2);
  const endHour = odd ? startHour : startHour + 1;
  const startMinute = odd ? '00' : '30';
  const endMinute = !odd ? '00' : '30';

  return `${startHour}:${startMinute}~${endHour}:${endMinute}`;
}

export class EmptyTimeUnitItem extends React.Component {
  _handleCreateTimeUnitButtonClick = event => {
    this._createTimeUnit();
  };

  _createTimeUnit(positioin) {
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
      <Card title={mapPositionToTimeRange(position)}>
        <IconButtonGroup>
          <IconButton
            icon="plus"
            label="Create TimeUnit"
            onClick={this._handleCreateTimeUnitButtonClick}
          />
        </IconButtonGroup>
      </Card>
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
