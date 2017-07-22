import React from 'react';
import styled from 'styled-components';
import { createFragmentContainer, graphql } from 'react-relay';
import getNodesFromConnection from '../../shared/utils/getNodesFromConnection';
import RemoveTimeUnitMutation from '../../graphql/mutations/RemoveTimeUnitMutation';
import AddTaskUnitModal from './AddTaskUnitModal';
import Card from './Card';
import Icon from './Icon';
import IconButtonGroup from './IconButtonGroup';
import TaskUnitItem from './TaskUnitItem';
import TitlePlaceholder from './TitlePlaceholder';
import UpdateTimeUnitTitleModal from './UpdateTimeUnitTitleModal';

const SmallIconButtonGroup = styled(IconButtonGroup)`
  font-size: 0.75rem;
`;

function mapPositionToTimeRange(position) {
  const odd = position % 2 === 0;
  const startHour = Math.floor(position / 2);
  const endHour = odd ? startHour : startHour + 1;
  const startMinute = odd ? '00' : '30';
  const endMinute = !odd ? '00' : '30';

  return `${startHour}:${startMinute}~${endHour}:${endMinute}`;
}

export function TaskSummary({ dailySchedule, taskUnits, timeUnit, viewer }) {
  return (
    <IconButtonGroup>
      {taskUnits.map(taskUnit =>
        <TaskUnitItem
          key={taskUnit.id}
          dailySchedule={dailySchedule}
          taskUnit={taskUnit}
          timeUnit={timeUnit}
          viewer={viewer}
        />,
      )}
    </IconButtonGroup>
  );
}

function RemoveButton({ onClick }) {
  return <Icon icon="trash" onClick={onClick} />;
}

export class TimeUnitItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isAddTaskUnitModalOpen: false,
      isUpdateTitleModalOpen: false,
    };
  }

  _handleAddTaskUnitButtonClick = event => {
    this.setState({ isAddTaskUnitModalOpen: true });
  };

  _handleTitleClick = event => {
    this.setState({ isUpdateTitleModalOpen: true });
  };

  _handleModalClose = () => {
    this.setState({
      isAddTaskUnitModalOpen: false,
      isUpdateTitleModalOpen: false,
    });
  };

  _handleRemoveButtonClick = () => {
    this._removeTimeUnit();
  };

  _removeTimeUnit() {
    const { relay, timeUnit, dailySchedule } = this.props;

    RemoveTimeUnitMutation.commit(relay.environment, timeUnit, dailySchedule);
  }

  render() {
    const { timeUnit, viewer, dailySchedule } = this.props;
    const { isAddTaskUnitModalOpen, isUpdateTitleModalOpen } = this.state;
    const taskUnits = getNodesFromConnection(timeUnit.taskUnits);

    return (
      <Card
        title={
          <div>
            {mapPositionToTimeRange(timeUnit.position)}{' '}
            <TitlePlaceholder
              label={timeUnit.title}
              onClick={this._handleTitleClick}
            />
            <SmallIconButtonGroup>
              <RemoveButton onClick={this._handleRemoveButtonClick} />
            </SmallIconButtonGroup>
          </div>
        }
      >
        <TaskSummary
          dailySchedule={dailySchedule}
          taskUnits={taskUnits}
          timeUnit={timeUnit}
          viewer={viewer}
        />
        <AddTaskUnitModal
          dailySchedule={dailySchedule}
          isOpen={isAddTaskUnitModalOpen}
          onRequestClose={this._handleModalClose}
          timeUnit={timeUnit}
          viewer={viewer}
        />
        <UpdateTimeUnitTitleModal
          dailySchedule={dailySchedule}
          isOpen={isUpdateTitleModalOpen}
          onRequestClose={this._handleModalClose}
          timeUnit={timeUnit}
        />
      </Card>
    );
  }
}

export default createFragmentContainer(
  TimeUnitItem,
  graphql.experimental`
    fragment TimeUnitItem_timeUnit on TimeUnit
      @argumentDefinitions(count: { type: "Int", defaultValue: 100 }) {
      id
      title
      position
      taskUnits(first: $count) @connection(key: "TimeUnitItem_taskUnits") {
        edges {
          node {
            id
            done
            taskSet {
              id
              title
            }
            ...TaskUnitItem_taskUnit
          }
        }
      }
      ...AddTaskUnitModal_timeUnit
      ...UpdateTimeUnitTitleModal_timeUnit
      ...TaskUnitItem_timeUnit
    }

    fragment TimeUnitItem_dailySchedule on DailySchedule {
      id
      ...AddTaskUnitModal_dailySchedule
      ...UpdateTimeUnitTitleModal_dailySchedule
      ...TaskUnitItem_dailySchedule
    }

    fragment TimeUnitItem_viewer on User {
      ...AddTaskUnitModal_viewer
      ...TaskUnitItem_viewer
    }
  `,
);
