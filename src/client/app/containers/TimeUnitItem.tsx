import * as React from 'react';
import { graphql, compose, QueryProps, ChildProps } from 'react-apollo';
import {
  TimeUnitItem_timeUnitFragment,
  TimeUnitTaskItem_taskFragment,
  TimeUnitItem_phasesFragment,
} from 'schema';
import { DropTarget, DropTargetSpec, ConnectDropTarget } from 'react-dnd';
import * as UpdateTimeUnitMutation from '../../graphql/mutations/UpdateTimeUnitMutation';
import * as MoveTaskToTimeUnitMutation from '../../graphql/mutations/MoveTaskToTimeUnitMutation';
import * as RemoveTimeUnitMutation from '../../graphql/mutations/RemoveTimeUnitMutation';
import * as RemoveTaskMutation from '../../graphql/mutations/RemoveTaskMutation';
import styled, { ThemedProps } from '../styles/StyledComponents';
import Icon from '../components/Icon';
import TitleInput from '../components/TitleInput';
import TitlePlaceholder from '../components/TitlePlaceholder';
import DoneCheckbox from '../components/DoneCheckbox';
import InputWithButton from '../components/InputWithButton';
import IconButtonGroup from '../components/IconButtonGroup';
import TimeLabel from '../components/TimeLabel';
import ItemTypes from '../constants/ItemTypes';
import Theme from '../constants/Theme';
import AddTaskToTimeUnitForm from '../containers/AddTaskToTimeUnitForm';
import { DateOnly } from '../interfaces';
import TimeUnitTaskItem from './TimeUnitTaskItem';

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
  background: ${({ isOver }: ThemedProps<{ isOver: boolean }>) =>
    isOver ? '#c0e3fb' : 'inherit'};
`;

interface TaskSummaryProps {
  tasks: Array<TimeUnitTaskItem_taskFragment | null>;
  timeUnit: TimeUnitItem_timeUnitFragment;
  removeTask(task: TimeUnitTaskItem_taskFragment): void;
}

function TaskSummary({ tasks, timeUnit, removeTask }: TaskSummaryProps) {
  return (
    <SummaryWrapper>
      {tasks.map(
        task =>
          task &&
          <TimeUnitTaskItem key={task.id} task={task} remove={removeTask} />,
      )}
    </SummaryWrapper>
  );
}

function RemoveButton({
  onClick,
}: {
  onClick: React.MouseEventHandler<HTMLElement>;
}) {
  return <Icon icon="trash" onClick={onClick} />;
}

interface OwnProps {
  date: DateOnly;
  timeUnit: TimeUnitItem_timeUnitFragment;
  phases: (TimeUnitItem_phasesFragment | null)[];
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
  phases,
  removeTask,
  connectDropTarget,
  updateDescription,
  isOver,
}: Props) {
  return connectDropTarget(
    <div>
      <Wrapper isOver={isOver}>
        <div>
          {timeUnit.position &&
            <span>
              <TimeLabel position={timeUnit.position} />{' '}
            </span>}
          <TitleInput
            title={timeUnit.description || ''}
            onChange={updateDescription}
          />
          <SmallIconButtonGroup>
            <RemoveButton onClick={removeTimeUnit} />
          </SmallIconButtonGroup>
        </div>
        {timeUnit.tasks &&
          <TaskSummary
            tasks={timeUnit.tasks}
            timeUnit={timeUnit}
            removeTask={removeTask}
          />}
        <AddTaskToTimeUnitForm timeUnit={timeUnit} phases={phases} />
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
  graphql<Response, OwnProps, Props>(RemoveTaskMutation.mutation, {
    props: ({ mutate, ownProps: { timeUnit } }) => ({
      removeTask: (task: TimeUnitTaskItem_taskFragment) =>
        mutate &&
        mutate(
          RemoveTaskMutation.buildMutationOptions(
            { taskId: task.id },
            { done: false },
            { timeUnit },
          ),
        ),
    }),
  }),
  graphql<Response, OwnProps, Props>(RemoveTimeUnitMutation.mutation, {
    props: ({ mutate, ownProps: { date, timeUnit } }) => ({
      removeTimeUnit: (title: string) =>
        mutate &&
        mutate(
          RemoveTimeUnitMutation.buildMutationOptions(
            { timeUnitId: timeUnit.id },
            { date },
          ),
        ),
    }),
  }),
  graphql<Response, OwnProps, Props>(UpdateTimeUnitMutation.mutation, {
    props: ({ mutate, ownProps: { timeUnit } }) => ({
      updateDescription: (description: string) =>
        mutate &&
        mutate(
          UpdateTimeUnitMutation.buildMutationOptions(
            { description, timeUnitId: timeUnit.id },
            { done: false },
            timeUnit,
          ),
        ),
    }),
  }),
  graphql<Response, OwnProps, Props>(MoveTaskToTimeUnitMutation.mutation, {
    props: ({ mutate }) => ({
      moveTaskToTimeUnit: (taskId: string, timeUnitId: string) =>
        mutate &&
        mutate(
          MoveTaskToTimeUnitMutation.buildMutationOptions(
            { taskId, timeUnitId },
            {},
          ),
        ),
    }),
  }),
  DropTarget(ItemTypes.TASK_UNIT, taskTarget, (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver({ shallow: true }),
  })),
);

export default withData(TimeUnitItem);
