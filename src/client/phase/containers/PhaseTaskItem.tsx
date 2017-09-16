import * as React from 'react';
import { graphql, compose, QueryProps, ChildProps } from 'react-apollo';
import {
  DragSource,
  DragSourceSpec,
  ConnectDragSource,
  ConnectDragPreview,
} from 'react-dnd';
import { PhasePageQueryVariables, PhaseTaskItem_taskFragment } from 'schema';
import * as UpdatePhaseTaskMutation from '../mutations/UpdatePhaseTaskMutation';
import * as SetTimeUnitToTaskMutation from '../mutations/SetTimeUnitToTaskMutation';
import styled, { ThemedProps } from '../../shared/styles/StyledComponents';
import TaskLabel from '../../shared/components/TaskLabel';
import TimeUnitSelect from '../components/TimeUnitSelect';
import Icon from '../../shared/components/Icon';
import ItemTypes from '../../shared/constants/ItemTypes';
import { DateOnly } from '../../app/interfaces';

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
  task: PhaseTaskItem_taskFragment;
  phaseId?: string;
  remove(task: PhaseTaskItem_taskFragment): void;
  timeUnitId?: string;
  queryVariables: PhasePageQueryVariables;
}

type Props = OwnProps & {
  updateTitle(title: string): void;
  setTimeUnit(date: DateOnly, position: number | null): void;
  toggleDone(): void;
  isDragging: boolean;
  connectDragSource: ConnectDragSource;
  connectDragPreview: ConnectDragPreview;
};

export function PhaseTaskItem({
  task,
  updateTitle,
  toggleDone,
  setTimeUnit,
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
        <TimeUnitSelect onSelect={setTimeUnit} />
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
    props: ({ mutate, ownProps: { task, queryVariables } }) => ({
      updateTitle: (title: string) =>
        mutate &&
        mutate(
          UpdatePhaseTaskMutation.buildMutationOptions(
            { title, taskId: task.id },
            queryVariables,
            task,
          ),
        ),
      toggleDone: () =>
        mutate &&
        mutate(
          UpdatePhaseTaskMutation.buildMutationOptions(
            { done: !task.done, taskId: task.id },
            queryVariables,
            task,
          ),
        ),
    }),
  }),
  graphql<Response, OwnProps, Props>(SetTimeUnitToTaskMutation.mutation, {
    props: ({ mutate, ownProps: { task } }) => ({
      setTimeUnit: (date: DateOnly, position: number | null) =>
        mutate &&
        mutate(
          SetTimeUnitToTaskMutation.buildMutationOptions(
            { date, position, taskId: task.id },
            {},
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

export default withData(PhaseTaskItem);
