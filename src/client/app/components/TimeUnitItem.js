import React from 'react';
import styled from 'styled-components';
import { DropTarget } from 'react-dnd';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createFragmentContainer, graphql } from 'react-relay';
import getNodesFromConnection from '../../shared/utils/getNodesFromConnection';
import RemoveTimeUnitMutation from '../../graphql/mutations/RemoveTimeUnitMutation';
import UpdateTimeUnitMutation from '../../graphql/mutations/UpdateTimeUnitMutation';
import openAddTaskUnitModal from '../../redux/actions/openAddTaskUnitModal';
import ItemTypes from '../constants/ItemTypes';
import Icon from './Icon';
import IconButtonGroup from './IconButtonGroup';
import TaskUnitItem from './TaskUnitItem';
import TitleInput from './TitleInput';
import TimeLabel from './TimeLabel';

const SmallIconButtonGroup = styled(IconButtonGroup)`
  margin-right: 1rem;
  float: right;
  font-size: ${({ theme }) => theme.shared.fontSize};
`;

const SummaryWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
`;

const Wrapper = styled.div`
  padding-top: 0.4rem;
  border-top: 1px solid #e4eaf7;
  background: ${({ isOver }) => (isOver ? '#c0e3fb' : 'inherit')};
`;

export function TaskSummary({
  dailySchedule,
  taskUnits,
  timeUnit,
  viewer,
  onAddTaskUnitButtonClick,
}) {
  return (
    <SummaryWrapper>
      {taskUnits.map(taskUnit =>
        <TaskUnitItem
          key={taskUnit.id}
          dailySchedule={dailySchedule}
          taskUnit={taskUnit}
          timeUnit={timeUnit}
          viewer={viewer}
        />,
      )}
      <Icon large icon="plus-circle" onClick={onAddTaskUnitButtonClick} />
    </SummaryWrapper>
  );
}

function RemoveButton({ onClick }) {
  return <Icon icon="trash" onClick={onClick} />;
}

export class TimeUnitItem extends React.Component {
  _handleTitleChange = ({ title }) => {
    this._updateTitle(title);
  };

  _handleAddTaskUnitButtonClick = () => {
    const { onAddTaskUnitButtonClick, timeUnit } = this.props;

    onAddTaskUnitButtonClick({ timeUnitId: timeUnit.id });
  };

  _handleRemoveButtonClick = () => {
    this._removeTimeUnit();
  };

  _updateTitle(title) {
    const { relay, timeUnit, dailySchedule } = this.props;

    UpdateTimeUnitMutation.commit(
      relay.environment,
      { title },
      timeUnit,
      dailySchedule,
    );
  }

  _removeTimeUnit() {
    const { relay, timeUnit, dailySchedule } = this.props;

    RemoveTimeUnitMutation.commit(relay.environment, timeUnit, dailySchedule);
  }

  render() {
    const {
      timeUnit,
      viewer,
      dailySchedule,
      connectDropTarget,
      isOver,
    } = this.props;
    const taskUnits = getNodesFromConnection(timeUnit.taskUnits);

    return connectDropTarget(
      <div>
        <Wrapper isOver={isOver}>
          <div>
            <TimeLabel position={timeUnit.position} />{' '}
            <TitleInput
              title={timeUnit.title}
              onChange={this._handleTitleChange}
            />
            <SmallIconButtonGroup>
              <RemoveButton onClick={this._handleRemoveButtonClick} />
            </SmallIconButtonGroup>
          </div>
          <TaskSummary
            dailySchedule={dailySchedule}
            onAddTaskUnitButtonClick={this._handleAddTaskUnitButtonClick}
            taskUnits={taskUnits}
            timeUnit={timeUnit}
            viewer={viewer}
          />
        </Wrapper>
      </div>,
    );
  }
}

const mapDispatchToProps = {
  onAddTaskUnitButtonClick: openAddTaskUnitModal,
};

const taskUnitTarget = {
  drop: ({ timeUnit }, monitor) => {
    if (monitor.didDrop()) {
      return;
    }

    const { taskSetId } = monitor.getItem();
    const taskUnits = getNodesFromConnection(timeUnit.taskUnits);
    if (taskUnits.find(taskUnit => taskUnit.taskSet.id === taskSetId)) {
      return { canMove: false };
    }

    return { canMove: true, toTimeUnitId: timeUnit.id };
  },
};

export default createFragmentContainer(
  compose(
    connect(undefined, mapDispatchToProps),
    DropTarget(ItemTypes.TASK_UNIT, taskUnitTarget, (connect, monitor) => ({
      connectDropTarget: connect.dropTarget(),
      isOver: monitor.isOver({ shallow: true }),
    })),
  )(TimeUnitItem),
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
      ...TaskUnitItem_timeUnit
    }

    fragment TimeUnitItem_dailySchedule on DailySchedule {
      id
      ...TaskUnitItem_dailySchedule
    }

    fragment TimeUnitItem_viewer on User {
      ...TaskUnitItem_viewer
    }
  `,
);
