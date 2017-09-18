import * as React from 'react';
import { graphql, compose, QueryProps, ChildProps } from 'react-apollo';
import {
  DragSource,
  DragSourceSpec,
  ConnectDragSource,
  ConnectDragPreview,
} from 'react-dnd';
import { TaskPageQueryVariables, TaskActionItem_actionFragment } from 'schema';
import { UpdateTaskAction, SetPeriodToAction } from '../mutations';
import { styled, ThemedProps } from '../../shared/styles';
import { ItemTypes } from '../../shared/constants';
import { Icon, ActionLabel } from '../../shared/components';
import { PeriodSelect } from '../components';
import { DateOnly } from '../../shared/interfaces';

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
  action: TaskActionItem_actionFragment;
  taskId?: string;
  remove(action: TaskActionItem_actionFragment): void;
  periodId?: string;
  queryVariables: TaskPageQueryVariables;
}

type Props = OwnProps & {
  updateTitle(title: string): void;
  setPeriod(date: DateOnly, position: number | null): void;
  toggleDone(): void;
  isDragging: boolean;
  connectDragSource: ConnectDragSource;
  connectDragPreview: ConnectDragPreview;
};

export function TaskActionItem({
  action,
  updateTitle,
  toggleDone,
  setPeriod,
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
        <ActionLabel
          label={action.title}
          done={action.done}
          onCheckboxChange={toggleDone}
          onLabelChange={updateTitle}
          onRemoveButtonClick={() => remove(action)}
        />
        <PeriodSelect onSelect={setPeriod} />
      </Wrapper>
    </div>,
  );
}

const actionSource: DragSourceSpec<Props> = {
  beginDrag: ({ action }) => ({
    actionId: action.id,
  }),
  endDrag: (_, monitor) => {
    if (!monitor) {
      return;
    }

    if (!monitor.didDrop()) {
      return;
    }

    const { canMove, toPeriodId } = monitor.getDropResult() as any;
    if (!canMove) {
      return;
    }
  },
};

const withData = compose(
  graphql<Response, OwnProps, Props>(UpdateTaskAction.mutation, {
    props: ({ mutate, ownProps: { action, queryVariables } }) => ({
      updateTitle: (title: string) =>
        mutate &&
        mutate(
          UpdateTaskAction.build(
            { title, actionId: action.id },
            queryVariables,
            action,
          ),
        ),
      toggleDone: () =>
        mutate &&
        mutate(
          UpdateTaskAction.build(
            { done: !action.done, actionId: action.id },
            queryVariables,
            action,
          ),
        ),
    }),
  }),
  graphql<Response, OwnProps, Props>(SetPeriodToAction.mutation, {
    props: ({ mutate, ownProps: { action } }) => ({
      setPeriod: (date: DateOnly, position: number | null) =>
        mutate &&
        mutate(
          SetPeriodToAction.build({ date, position, actionId: action.id }, {}),
        ),
    }),
  }),
  DragSource(ItemTypes.action, actionSource, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging(),
  })),
);

export default withData(TaskActionItem);
