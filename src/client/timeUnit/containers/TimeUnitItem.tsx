import * as React from 'react';
import { graphql, compose, QueryProps, ChildProps } from 'react-apollo';
import {
  TimeUnitPageQueryVariables,
  TimeUnitItem_timeUnitFragment,
  TimeUnitTaskItem_taskFragment,
} from 'schema';
import { DropTarget, DropTargetSpec, ConnectDropTarget } from 'react-dnd';
import {
  UpdateTimeUnit,
  MoveTaskToTimeUnit,
  RemoveTimeUnit,
  RemoveTimeUnitTask,
} from '../mutations';
import styled, { ThemedProps } from '../../shared/styles/StyledComponents';
import Icon from '../../shared/components/Icon';
import TitleInput from '../../shared/components/TitleInput';
import TitlePlaceholder from '../../shared/components/TitlePlaceholder';
import DoneCheckbox from '../../shared/components/DoneCheckbox';
import InputWithButton from '../../shared/components/InputWithButton';
import IconButtonGroup from '../../shared/components/IconButtonGroup';
import TimeLabel from '../components/TimeLabel';
import Button from '../../shared/components/Button';
import ItemTypes from '../../shared/constants/ItemTypes';
import Theme from '../../shared/constants/Theme';
import { DateOnly } from '../../app/interfaces';
import AddTaskToTimeUnitForm from './AddTaskToTimeUnitForm';
import TimeUnitTaskItem from './TimeUnitTaskItem';

const SmallIconButtonGroup = styled(IconButtonGroup)`
  padding-right: 1rem;
  font-size: ${({ theme }) => theme.shared.fontSize};
`;

const AddTaskToTimeUnitFormWrapper = styled.div`
  margin-left: 5.6rem;
  margin-top: 0.8rem;
`;

const StyledButton = styled(Button)`margin-left: 3.2rem;`;

const Header = styled.span`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
`;

const Partition = styled.div`
  height: 1px;
  border-top: 1px solid rgba(180, 188, 255, 0.6);
  flex-grow: 1;
`;

const TimeUnitTaskItemWrapper = styled.div`margin-left: 2.4rem;`;

const Wrapper = styled.div`
  width: 100%;
  padding: 0.8rem;
  background: ${({ isOver }: ThemedProps<{ isOver: boolean }>) =>
    isOver ? '#c0e3fb' : 'inherit'};
  font-size: 1.6rem;
`;

interface RemoveButtonProps {
  onClick: React.MouseEventHandler<HTMLElement>;
}

function RemoveButton({ onClick }: RemoveButtonProps) {
  return <Icon icon="trash" onClick={onClick} />;
}

interface OwnProps {
  date: DateOnly;
  timeUnit: TimeUnitItem_timeUnitFragment;
  queryVariables: TimeUnitPageQueryVariables;
}

type Props = OwnProps & {
  updateDescription(description: string): void;
  moveTaskToTimeUnit(taskId: string, timeUnitId: string): void;
  removeTimeUnit(): void;
  removeTask(task: TimeUnitTaskItem_taskFragment): void;
  connectDropTarget: ConnectDropTarget;
  isOver: boolean;
};

export function TimeUnitItem({
  removeTimeUnit,
  timeUnit,
  removeTask,
  connectDropTarget,
  updateDescription,
  isOver,
}: Props) {
  const hasTask = timeUnit.tasks && timeUnit.tasks.length;

  return connectDropTarget(
    <div>
      <Wrapper isOver={isOver}>
        <Header>
          {timeUnit.position != null && (
            <TimeLabel activated position={timeUnit.position} />
          )}
          <Partition />
          {!hasTask && (
            <SmallIconButtonGroup>
              <RemoveButton onClick={removeTimeUnit} />
            </SmallIconButtonGroup>
          )}
        </Header>
        {timeUnit.tasks &&
          timeUnit.tasks.map(
            task =>
              task && (
                <TimeUnitTaskItemWrapper key={task.id}>
                  <TimeUnitTaskItem task={task} remove={removeTask} />
                </TimeUnitTaskItemWrapper>
              ),
          )}
        <AddTaskToTimeUnitFormWrapper>
          <AddTaskToTimeUnitForm timeUnit={timeUnit} />
        </AddTaskToTimeUnitFormWrapper>
      </Wrapper>
    </div>,
  );
}

const taskTarget: DropTargetSpec<Props> = {
  drop: ({ timeUnit, moveTaskToTimeUnit }, monitor) => {
    if (!monitor || !timeUnit) {
      return;
    }

    if (monitor.didDrop()) {
      return;
    }

    const { taskId } = monitor.getItem() as any;
    if (
      timeUnit.tasks &&
      timeUnit.tasks.find(task => !!task && task.id === taskId)
    ) {
      return { canMove: false };
    }

    moveTaskToTimeUnit(taskId, timeUnit.id);

    return { canMove: true, toTimeUnitId: timeUnit.id };
  },
};

const withData = compose(
  graphql<Response, OwnProps, Props>(RemoveTimeUnitTask.mutation, {
    props: ({ mutate, ownProps: { timeUnit, queryVariables } }) => ({
      removeTask: (task: TimeUnitTaskItem_taskFragment) =>
        mutate &&
        mutate(
          RemoveTimeUnitTask.build(
            { taskId: task.id },
            queryVariables,
            timeUnit,
          ),
        ),
    }),
  }),
  graphql<Response, OwnProps, Props>(RemoveTimeUnit.mutation, {
    props: ({ mutate, ownProps: { date, timeUnit, queryVariables } }) => ({
      removeTimeUnit: (title: string) =>
        mutate &&
        mutate(
          RemoveTimeUnit.build({ timeUnitId: timeUnit.id }, queryVariables),
        ),
    }),
  }),
  graphql<Response, OwnProps, Props>(UpdateTimeUnit.mutation, {
    props: ({ mutate, ownProps: { timeUnit, queryVariables } }) => ({
      updateDescription: (description: string) =>
        mutate &&
        mutate(
          UpdateTimeUnit.build(
            { description, timeUnitId: timeUnit.id },
            queryVariables,
            timeUnit,
          ),
        ),
    }),
  }),
  graphql<Response, OwnProps, Props>(MoveTaskToTimeUnit.mutation, {
    props: ({ mutate, ownProps: { queryVariables } }) => ({
      moveTaskToTimeUnit: (taskId: string, timeUnitId: string) =>
        mutate &&
        mutate(
          MoveTaskToTimeUnit.build({ taskId, timeUnitId }, queryVariables),
        ),
    }),
  }),
  DropTarget(ItemTypes.TASK, taskTarget, (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver({ shallow: true }),
  })),
);

export default withData(TimeUnitItem);
