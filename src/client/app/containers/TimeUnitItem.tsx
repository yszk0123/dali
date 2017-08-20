import * as React from 'react';
import styled, { ThemedProps } from '../styles/StyledComponents';
import { graphql, compose, QueryProps, ChildProps } from 'react-apollo';
import { TimeUnitItem_timeUnitFragment, TaskItem_taskFragment } from 'schema';
import { DropTarget, DropTargetSpec, ConnectDropTarget } from 'react-dnd';
import * as UpdateTimeUnitMutation from '../../graphql/mutations/UpdateTimeUnitMutation';
import * as RemoveTimeUnitMutation from '../../graphql/mutations/RemoveTimeUnitMutation';
import Icon from '../components/Icon';
import TitleInput from '../components/TitleInput';
import TitlePlaceholder from '../components/TitlePlaceholder';
import DoneCheckbox from '../components/DoneCheckbox';
import IconButtonGroup from '../components/IconButtonGroup';
import TimeLabel from '../components/TimeLabel';
import ItemTypes from '../constants/ItemTypes';
import TaskItem from './TaskItem';
import Theme from '../constants/Theme';
import { DateOnly } from '../interfaces';

// FIXME
const noop: Function = (): any => null;

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
  tasks: TaskItem_taskFragment[];
  timeUnit: TimeUnitItem_timeUnitFragment;
  onAddTaskUnitButtonClick: any;
}

function TaskSummary({
  tasks,
  timeUnit,
  onAddTaskUnitButtonClick,
}: TaskSummaryProps) {
  return (
    <SummaryWrapper>
      {tasks.map(task => <TaskItem key={task.id} task={task} />)}
      <Icon large icon="plus-circle" onClick={onAddTaskUnitButtonClick} />
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
}

type Props = OwnProps & {
  updateDescription(input: { title: string }): void;
  removeTimeUnit(): void;
  connectDropTarget: ConnectDropTarget;
  isOver: boolean;
};

export function TimeUnitItem({
  removeTimeUnit,
  timeUnit,
  connectDropTarget,
  updateDescription,
  isOver,
}: Props) {
  return connectDropTarget(
    <div>
      <Wrapper isOver={isOver}>
        <div>
          <TimeLabel position={timeUnit.position} />{' '}
          <TitleInput
            title={timeUnit.description}
            onChange={updateDescription}
          />
          <SmallIconButtonGroup>
            <RemoveButton onClick={removeTimeUnit} />
          </SmallIconButtonGroup>
        </div>
        <TaskSummary
          onAddTaskUnitButtonClick={noop}
          tasks={timeUnit.tasks}
          timeUnit={timeUnit}
        />
      </Wrapper>
    </div>,
  );
}

const taskTarget: DropTargetSpec<Props> = {
  drop: ({ timeUnit }, monitor) => {
    if (monitor.didDrop()) {
      return;
    }

    const { taskId } = monitor.getItem() as any;
    if (timeUnit.tasks.find(task => task.id === taskId)) {
      return { canMove: false };
    }

    return { canMove: true, toTimeUnitId: timeUnit.id };
  },
};

const withData = compose(
  graphql<Response, OwnProps, Props>(RemoveTimeUnitMutation.mutation, {
    props: ({ mutate, ownProps: { date, timeUnit } }) => ({
      removeTimeUnit: (title: string) =>
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
      updateDescription: ({ title: description }: { title: string }) =>
        mutate(
          UpdateTimeUnitMutation.buildMutationOptions(
            { description, timeUnitId: timeUnit.id },
            { done: false },
            timeUnit,
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
