import * as React from 'react';
import { graphql, compose, QueryProps, ChildProps } from 'react-apollo';
import {
  TimeUnitItem_timeUnitFragment,
  TimeUnitTaskItem_taskFragment,
} from 'schema';
import { DropTarget, DropTargetSpec, ConnectDropTarget } from 'react-dnd';
import * as UpdateTimeUnitMutation from '../../graphql/mutations/UpdateTimeUnitMutation';
import * as MoveTaskToTimeUnitMutation from '../../graphql/mutations/MoveTaskToTimeUnitMutation';
import * as RemoveTimeUnitMutation from '../../graphql/mutations/RemoveTimeUnitMutation';
import * as RemoveTimeUnitTaskMutation from '../../graphql/mutations/RemoveTimeUnitTaskMutation';
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
  padding-right: 1rem;
  font-size: ${({ theme }) => theme.shared.fontSize};
`;

const AddTaskToTimeUnitFormWrapper = styled.div`margin-top: 0.8rem;`;

const Header = styled.span`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
`;

const Wrapper = styled.div`
  width: 100%;
  padding: 1.2rem;
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
    <div>
      {tasks.map(
        task =>
          task &&
          <TimeUnitTaskItem key={task.id} task={task} remove={removeTask} />,
      )}
    </div>
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
  updateDescription(description: string): void;
  moveTaskToTimeUnit(taskId: string, timeUnitId: string): void;
  removeTimeUnit(): void;
  removeTask(task: TimeUnitTaskItem_taskFragment): void;
  connectDropTarget: ConnectDropTarget;
  isOver: boolean;
};

interface State {
  isEditing: boolean;
}

export class TimeUnitItem extends React.Component<
  ChildProps<Props, Response>,
  State
> {
  state = {
    isEditing: false,
  };

  private handleOpenForm = () => {
    this.setState({ isEditing: true });
  };

  private handleCloseForm = () => {
    this.setState({ isEditing: false });
  };

  render() {
    const {
      removeTimeUnit,
      timeUnit,
      removeTask,
      connectDropTarget,
      updateDescription,
      isOver,
    } = this.props;
    const { isEditing } = this.state;

    return connectDropTarget(
      <div>
        <Wrapper isOver={isOver}>
          <Header>
            {timeUnit.position != null &&
              <span>
                <TimeLabel position={timeUnit.position} />{' '}
              </span>}
            <SmallIconButtonGroup>
              <RemoveButton onClick={removeTimeUnit} />
            </SmallIconButtonGroup>
          </Header>
          {timeUnit.tasks &&
            <TaskSummary
              tasks={timeUnit.tasks}
              timeUnit={timeUnit}
              removeTask={removeTask}
            />}
          {isEditing
            ? <AddTaskToTimeUnitFormWrapper>
                <AddTaskToTimeUnitForm
                  timeUnit={timeUnit}
                  onClose={this.handleCloseForm}
                />
              </AddTaskToTimeUnitFormWrapper>
            : <button onClick={this.handleOpenForm}>Add</button>}
        </Wrapper>
      </div>,
    );
  }
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
  graphql<Response, OwnProps, Props>(RemoveTimeUnitTaskMutation.mutation, {
    props: ({ mutate, ownProps: { timeUnit } }) => ({
      removeTask: (task: TimeUnitTaskItem_taskFragment) =>
        mutate &&
        mutate(
          RemoveTimeUnitTaskMutation.buildMutationOptions(
            { taskId: task.id },
            { done: false },
            timeUnit,
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
