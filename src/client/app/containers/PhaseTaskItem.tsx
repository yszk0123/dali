import * as React from 'react';
import { graphql, compose, QueryProps, ChildProps } from 'react-apollo';
import {
  DragSource,
  DragSourceSpec,
  ConnectDragSource,
  ConnectDragPreview,
} from 'react-dnd';
import { TaskItem_taskFragment } from 'schema';
import * as UpdatePhaseTaskMutation from '../../graphql/mutations/UpdatePhaseTaskMutation';
import styled, { ThemedProps } from '../styles/StyledComponents';
import TaskLabel from '../components/TaskLabel';
import Icon from '../components/Icon';
import ItemTypes from '../constants/ItemTypes';

interface WrapperProps {
  isDragging: boolean;
}

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  opacity: ${({ isDragging }: ThemedProps<WrapperProps>) =>
    isDragging ? 0.5 : 1};
`;

interface OwnProps {
  task: TaskItem_taskFragment;
  phaseId?: string;
  remove(task: TaskItem_taskFragment): void;
  timeUnitId?: string;
}

type Props = OwnProps & {
  updateTitle(title: string): void;
  toggleDone(): void;
  isDragging: boolean;
  connectDragSource: ConnectDragSource;
  connectDragPreview: ConnectDragPreview;
};

export function TaskItem({
  task,
  updateTitle,
  toggleDone,
  remove,
  isDragging,
  connectDragSource,
  connectDragPreview,
}: Props) {
  return connectDragPreview(
    <div>
      <Wrapper isDragging={isDragging}>
        {connectDragSource(
          <div>
            <Icon cursor icon="bars" />
          </div>,
        )}
        <TaskLabel
          label={task.title}
          done={task.done}
          onCheckboxChange={toggleDone}
          onLabelChange={updateTitle}
          onRemoveButtonClick={() => remove(task)}
        />
      </Wrapper>
    </div>,
  );
}

const taskSource: DragSourceSpec<Props> = {
  beginDrag: ({ task }) => ({
    taskId: task.id,
  }),
  endDrag: (_, monitor) => {
    if (!monitor) {
      return;
    }

    if (!monitor.didDrop()) {
      return;
    }

    const { canMove, toTimeUnitId } = monitor.getDropResult() as any;
    if (!canMove) {
      return;
    }
  },
};

const withData = compose(
  graphql<Response, OwnProps, Props>(UpdatePhaseTaskMutation.mutation, {
    props: ({ mutate, ownProps: { task } }) => ({
      updateTitle: (title: string) =>
        mutate &&
        mutate(
          UpdatePhaseTaskMutation.buildMutationOptions(
            { title, taskId: task.id },
            { phaseDone: false, taskDone: false },
            task,
          ),
        ),
      toggleDone: () =>
        mutate &&
        mutate(
          UpdatePhaseTaskMutation.buildMutationOptions(
            { done: !task.done, taskId: task.id },
            { phaseDone: false, taskDone: false },
            task,
          ),
        ),
    }),
  }),
  DragSource(ItemTypes.TASK_UNIT, taskSource, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging(),
  })),
);

export default withData(TaskItem);
