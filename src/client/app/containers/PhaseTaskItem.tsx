import * as React from 'react';
import { graphql, compose, QueryProps, ChildProps } from 'react-apollo';
import { DragSource, DragSourceSpec, ConnectDragSource } from 'react-dnd';
import { TaskItem_taskFragment } from 'schema';
import * as UpdatePhaseTaskMutation from '../../graphql/mutations/UpdatePhaseTaskMutation';
import TaskLabel from '../components/TaskLabel';
import ItemTypes from '../constants/ItemTypes';

interface OwnProps {
  task: TaskItem_taskFragment;
  phaseId?: string;
  remove(task: TaskItem_taskFragment): void;
  timeUnitId?: string;
}

type Props = OwnProps & {
  toggleDone(): void;
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
        onRemoveButtonClick={() => remove(task)}
      />
    </span>,
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
      updateTitle: (input: { title: string }) =>
        mutate &&
        mutate(
          UpdatePhaseTaskMutation.buildMutationOptions(
            { ...input, taskId: task.id },
            { done: false },
            task,
          ),
        ),
      toggleDone: () =>
        mutate &&
        mutate(
          UpdatePhaseTaskMutation.buildMutationOptions(
            { done: !task.done, taskId: task.id },
            { done: false },
            task,
          ),
        ),
    }),
  }),
  DragSource(ItemTypes.TASK_UNIT, taskSource, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
  })),
);

export default withData(TaskItem);
