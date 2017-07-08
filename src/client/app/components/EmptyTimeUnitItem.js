/**
 * TODO: Extract sharable components
 */
import React from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import AddTimeUnitMutation from '../../graphql/mutations/AddTimeUnitMutation';

function mapPositionToTimeRange(position) {
  const odd = position % 2 === 0;
  const startHour = Math.floor(position / 2);
  const endHour = odd ? startHour : startHour + 1;
  const startMinute = odd ? '00' : '30';
  const endMinute = !odd ? '00' : '30';

  return `${startHour}:${startMinute}~${endHour}:${endMinute}`;
}

export function TaskSummary({ onClick }) {
  return (
    <div>
      <button onClick={onClick}>Create TimeUnit Here</button>
    </div>
  );
}

export function TimeRange({ position }) {
  return (
    <div>
      {mapPositionToTimeRange(position)}
    </div>
  );
}

export class EmptyTimeUnitItem extends React.Component {
  _handleAddTimeUnitButtonClick = event => {
    this._addTimeUnit();
  };

  _addTimeUnit(positioin) {
    const { relay, position, dailySchedule } = this.props;

    AddTimeUnitMutation.commit(relay.environment, { position }, dailySchedule);
  }

  render() {
    const { position } = this.props;

    return (
      <div>
        <TaskSummary onClick={this._handleAddTimeUnitButtonClick} />
        <TimeRange position={position} />
      </div>
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
