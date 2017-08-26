import * as React from 'react';
import { graphql, compose, QueryProps, ChildProps } from 'react-apollo';
import { DragSource, DragSourceSpec, ConnectDragSource } from 'react-dnd';
import { TimeUnitTaskItem_taskFragment } from 'schema';
import * as UpdateTimeUnitTaskMutation from '../../graphql/mutations/UpdateTimeUnitTaskMutation';
import styled from '../styles/StyledComponents';
import TaskLabel from '../components/TaskLabel';
import ItemTypes from '../constants/ItemTypes';

interface OwnProps {
  task: TimeUnitTaskItem_taskFragment;
  phaseId?: string;
  remove(task: TimeUnitTaskItem_taskFragment): void;
  timeUnitId?: string;
}

type Props = OwnProps & {
  toggleDone(): void;
  isDragging: boolean;
  connectDragSource: ConnectDragSource;
};

export function TimeUnitTaskItem({
  task,
  toggleDone,
  remove,
  isDragging,
  connectDragSource,
}: Props) {
  return connectDragSource(
    <div style={{ opacity: isDragging ? 0.5 : 1 }}>
      <TaskLabel
        icon="times-circle"
        label={task.title}
        subLabel={task.phase && task.phase.title}
        done={task.done}
        onLabelClick={toggleDone}
        onRemoveButtonClick={() => remove(task)}
      />
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
  graphql<Response, OwnProps, Props>(UpdateTimeUnitTaskMutation.mutation, {
    props: ({ mutate, ownProps: { task } }) => ({
      updateTitle: (input: { title: string }) =>
        mutate &&
        mutate(
          UpdateTimeUnitTaskMutation.buildMutationOptions(
            { ...input, taskId: task.id },
            { done: false },
            task,
          ),
        ),
      toggleDone: () =>
        mutate &&
        mutate(
          UpdateTimeUnitTaskMutation.buildMutationOptions(
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

export default withData(TimeUnitTaskItem);
