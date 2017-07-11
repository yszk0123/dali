import React from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import getNodesFromConnection from '../../shared/utils/getNodesFromConnection';
import LinkTaskUnitModal from './LinkTaskUnitModal';

function mapPositionToTimeRange(position) {
  const odd = position % 2 === 0;
  const startHour = Math.floor(position / 2);
  const endHour = odd ? startHour : startHour + 1;
  const startMinute = odd ? '00' : '30';
  const endMinute = !odd ? '00' : '30';

  return `${startHour}:${startMinute}~${endHour}:${endMinute}`;
}

export function TaskSummary({ taskUnits }) {
  return (
    <div>
      {taskUnits.map(taskUnit => taskUnit.title).join(', ')}
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

export function LinkTaskUnitButton({ onClick }) {
  return (
    <div>
      <button onClick={onClick}>Add TaskUnit Here</button>
    </div>
  );
}

export class TimeUnitItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalOpen: false,
    };
  }

  _handleLinkTaskUnitButtonClick = event => {
    this.setState({ isModalOpen: true });
  };

  _handleModalClose = () => {
    this.setState({ isModalOpen: false });
  };

  render() {
    const { timeUnit, viewer, dailySchedule } = this.props;
    const { isModalOpen } = this.state;
    const taskUnits = getNodesFromConnection(timeUnit.taskUnits);

    return (
      <div>
        <TaskSummary taskUnits={taskUnits} />
        <LinkTaskUnitButton onClick={this._handleLinkTaskUnitButtonClick} />
        <TimeRange position={timeUnit.position} />
        <LinkTaskUnitModal
          dailySchedule={dailySchedule}
          isOpen={isModalOpen}
          onClose={this._handleModalClose}
          timeUnit={timeUnit}
          viewer={viewer}
        />
      </div>
    );
  }
}

export default createFragmentContainer(
  TimeUnitItem,
  graphql.experimental`
    fragment TimeUnitItem_timeUnit on TimeUnit
      @argumentDefinitions(count: { type: "Int", defaultValue: 100 }) {
      position
      taskUnits(first: $count) @connection(key: "TimeUnitItem_taskUnits") {
        edges {
          node {
            id
            title
          }
        }
      }
      ...LinkTaskUnitModal_timeUnit
    }

    fragment TimeUnitItem_dailySchedule on DailySchedule {
      id
      ...LinkTaskUnitModal_dailySchedule
    }

    fragment TimeUnitItem_viewer on User {
      ...LinkTaskUnitModal_viewer
    }
  `,
);
