import * as React from 'react';
import { graphql, compose, QueryProps, ChildProps } from 'react-apollo';
import {
  DragSource,
  DragSourceSpec,
  ConnectDragSource,
  ConnectDragPreview,
} from 'react-dnd';
import { Link } from 'react-router-dom';
import { PeriodActionItem_actionFragment } from 'schema';
import { styled, ThemedProps } from '../../shared/styles';
import { Icon, ActionLabel } from '../../shared/components';
import { ItemTypes } from '../../shared/constants';
import { UpdatePeriodAction } from '../mutations';

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
  action: PeriodActionItem_actionFragment;
  taskId?: string;
  remove(action: PeriodActionItem_actionFragment): void;
  periodId?: string;
}

type Props = OwnProps & {
  updateTitle(title: string): void;
  toggleDone(): void;
  isDragging: boolean;
  connectDragSource: ConnectDragSource;
  connectDragPreview: ConnectDragPreview;
};

export function PeriodActionItem({
  action,
  updateTitle,
  toggleDone,
  remove,
  isDragging,
  connectDragSource,
  connectDragPreview,
}: Props) {
  const taskTitle = (action.task && action.task.title) || '';
  const projectTitle =
    (action.task && action.task.project && action.task.project.title) || '';

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
          subLabel={`${projectTitle} > ${taskTitle}`}
          done={action.done}
          onCheckboxChange={toggleDone}
          onLabelChange={updateTitle}
          onRemoveButtonClick={() => remove(action)}
        />
        <Link to={`/actions/${action.id}`}>
          <Icon icon="edit" />
        </Link>
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
  graphql<Response, OwnProps, Props>(UpdatePeriodAction.mutation, {
    props: ({ mutate, ownProps: { action } }) => ({
      updateTitle: (title: string) =>
        mutate &&
        mutate(
          UpdatePeriodAction.build(
            { title, actionId: action.id },
            { done: false },
            action,
          ),
        ),
      toggleDone: () =>
        mutate &&
        mutate(
          UpdatePeriodAction.build(
            { done: !action.done, actionId: action.id },
            { done: false },
            action,
          ),
        ),
    }),
  }),
  DragSource(ItemTypes.action, actionSource, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging(),
  })),
);

export default withData(PeriodActionItem);
