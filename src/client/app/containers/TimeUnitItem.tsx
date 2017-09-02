import * as React from 'react';
import { graphql, compose, QueryProps, ChildProps } from 'react-apollo';
import {
  TimeUnitPageQueryVariables,
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
import Button from '../components/Button';
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
const StyledButton = styled(Button)`margin-left: 1.6rem;`;

const Header = styled.span`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
`;

const TimeUnitTaskItemWrapper = styled.div`margin-left: 1.6rem;`;

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
            {timeUnit.position != null && (
              <TimeLabel activated position={timeUnit.position} />
            )}
            <SmallIconButtonGroup>
              <RemoveButton onClick={removeTimeUnit} />
            </SmallIconButtonGroup>
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
          {isEditing ? (
            <AddTaskToTimeUnitFormWrapper>
              <AddTaskToTimeUnitForm
                timeUnit={timeUnit}
                onClose={this.handleCloseForm}
              />
            </AddTaskToTimeUnitFormWrapper>
          ) : (
            <StyledButton onClick={this.handleOpenForm}>Add</StyledButton>
          )}
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
    props: ({ mutate, ownProps: { timeUnit, queryVariables } }) => ({
      removeTask: (task: TimeUnitTaskItem_taskFragment) =>
        mutate &&
        mutate(
          RemoveTimeUnitTaskMutation.buildMutationOptions(
            { taskId: task.id },
            queryVariables,
            timeUnit,
          ),
        ),
    }),
  }),
  graphql<Response, OwnProps, Props>(RemoveTimeUnitMutation.mutation, {
    props: ({ mutate, ownProps: { date, timeUnit, queryVariables } }) => ({
      removeTimeUnit: (title: string) =>
        mutate &&
        mutate(
          RemoveTimeUnitMutation.buildMutationOptions(
            { timeUnitId: timeUnit.id },
            queryVariables,
          ),
        ),
    }),
  }),
  graphql<Response, OwnProps, Props>(UpdateTimeUnitMutation.mutation, {
    props: ({ mutate, ownProps: { timeUnit, queryVariables } }) => ({
      updateDescription: (description: string) =>
        mutate &&
        mutate(
          UpdateTimeUnitMutation.buildMutationOptions(
            { description, timeUnitId: timeUnit.id },
            queryVariables,
            timeUnit,
          ),
        ),
    }),
  }),
  graphql<Response, OwnProps, Props>(MoveTaskToTimeUnitMutation.mutation, {
    props: ({ mutate, ownProps: { queryVariables } }) => ({
      moveTaskToTimeUnit: (taskId: string, timeUnitId: string) =>
        mutate &&
        mutate(
          MoveTaskToTimeUnitMutation.buildMutationOptions(
            { taskId, timeUnitId },
            queryVariables,
          ),
        ),
    }),
  }),
  DropTarget(ItemTypes.TASK, taskTarget, (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver({ shallow: true }),
  })),
);

export default withData(TimeUnitItem);
