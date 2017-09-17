import * as React from 'react';
import { graphql, compose, QueryProps, ChildProps } from 'react-apollo';
import {
  DragSource,
  DragSourceSpec,
  ConnectDragSource,
  ConnectDragPreview,
} from 'react-dnd';
import { Link } from 'react-router-dom';
import { TimeUnitTaskItem_taskFragment } from 'schema';
import { styled, ThemedProps } from '../../shared/styles';
import { Icon, TaskLabel } from '../../shared/components';
import { ItemTypes } from '../../shared/constants';
import { UpdateTimeUnitTask } from '../mutations';

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
  task: TimeUnitTaskItem_taskFragment;
  phaseId?: string;
  remove(task: TimeUnitTaskItem_taskFragment): void;
  timeUnitId?: string;
}

type Props = OwnProps & {
  updateTitle(title: string): void;
  toggleDone(): void;
  isDragging: boolean;
  connectDragSource: ConnectDragSource;
  connectDragPreview: ConnectDragPreview;
};

export function TimeUnitTaskItem({
  task,
  updateTitle,
  toggleDone,
  remove,
  isDragging,
  connectDragSource,
  connectDragPreview,
}: Props) {
  const phaseTitle = (task.phase && task.phase.title) || '';
  const projectTitle =
    (task.phase && task.phase.project && task.phase.project.title) || '';

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
          subLabel={`${projectTitle} > ${phaseTitle}`}
          done={task.done}
          onCheckboxChange={toggleDone}
          onLabelChange={updateTitle}
          onRemoveButtonClick={() => remove(task)}
        />
        <Link to={`/tasks/${task.id}`}>
          <Icon icon="edit" />
        </Link>
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
  graphql<Response, OwnProps, Props>(UpdateTimeUnitTask.mutation, {
    props: ({ mutate, ownProps: { task } }) => ({
      updateTitle: (title: string) =>
        mutate &&
        mutate(
          UpdateTimeUnitTask.build(
            { title, taskId: task.id },
            { done: false },
            task,
          ),
        ),
      toggleDone: () =>
        mutate &&
        mutate(
          UpdateTimeUnitTask.build(
            { done: !task.done, taskId: task.id },
            { done: false },
            task,
          ),
        ),
    }),
  }),
  DragSource(ItemTypes.TASK, taskSource, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging(),
  })),
);

export default withData(TimeUnitTaskItem);
