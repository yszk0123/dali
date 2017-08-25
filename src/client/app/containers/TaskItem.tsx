import * as React from 'react';
import { graphql, compose, QueryProps, ChildProps } from 'react-apollo';
import { DragSource, DragSourceSpec, ConnectDragSource } from 'react-dnd';
import { TaskItem_taskFragment } from 'schema';
import * as RemoveTaskMutation from '../../graphql/mutations/RemoveTaskMutation';
import * as UpdateTaskMutation from '../../graphql/mutations/UpdateTaskMutation';
import TaskLabel from '../components/TaskLabel';
import ItemTypes from '../constants/ItemTypes';

interface OwnProps {
  task: TaskItem_taskFragment;
  phaseId?: string;
}

type Props = OwnProps & {
  toggleDone(): void;
  remove(): void;
  isDragging: boolean;
  connectDragSource: ConnectDragSource;
};

export function TaskItem({
  task,
  toggleDone,
  remove,
  isDragging,
  connectDragSource,
}: Props) {
  return connectDragSource(
    <span style={{ opacity: isDragging ? 0.5 : 1 }}>
      <TaskLabel
        icon="times-circle"
        label={task.title}
        done={task.done}
        onLabelClick={toggleDone}
        onRemoveButtonClick={remove}
      />
    </span>,
  );
}

const taskUnitSource: DragSourceSpec<Props> = {
  beginDrag: ({ task }) => ({
    // fromTimeUnitId: timeUnit.id,
    // taskUnitId: taskUnit.id,
    // phaseId: taskUnit.phase.id,
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

    // move task
    console.log('[TODO] Move Task');
  },
};

const withData = compose(
  graphql<Response, OwnProps, Props>(RemoveTaskMutation.mutation, {
    props: ({ mutate, ownProps: { task, phaseId } }) => ({
      remove: () =>
        mutate &&
        mutate(
          RemoveTaskMutation.buildMutationOptions(
            { taskId: task.id },
            { done: false },
            { phaseId },
          ),
        ),
    }),
  }),
  graphql<Response, OwnProps, Props>(UpdateTaskMutation.mutation, {
    props: ({ mutate, ownProps: { task } }) => ({
      updateTitle: (input: { title: string }) =>
        mutate &&
        mutate(
          UpdateTaskMutation.buildMutationOptions(
            { ...input, taskId: task.id },
            { done: false },
            task,
          ),
        ),
      toggleDone: () =>
        mutate &&
        mutate(
          UpdateTaskMutation.buildMutationOptions(
            { done: !task.done, taskId: task.id },
            { done: false },
            task,
          ),
        ),
    }),
  }),
  DragSource(ItemTypes.TASK_UNIT, taskUnitSource, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
  })),
);

export default withData(TaskItem);
