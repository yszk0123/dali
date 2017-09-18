import * as React from 'react';
import { graphql, compose, QueryProps, ChildProps } from 'react-apollo';
import {
  PeriodPageQueryVariables,
  PeriodItem_periodFragment,
  PeriodActionItem_actionFragment,
} from 'schema';
import { DropTarget, DropTargetSpec, ConnectDropTarget } from 'react-dnd';
import { styled, ThemedProps } from '../../shared/styles';
import {
  Button,
  TitleInput,
  TitlePlaceholder,
  DoneCheckbox,
  InputWithButton,
  Icon,
  IconButtonGroup,
} from '../../shared/components';
import { ItemTypes, Theme } from '../../shared/constants';
import { DateOnly } from '../../shared/interfaces';
import {
  UpdatePeriod,
  MoveActionToPeriod,
  RemovePeriod,
  RemovePeriodAction,
} from '../mutations';
import TimeLabel from '../components/TimeLabel';
import AddActionToPeriodForm from './AddActionToPeriodForm';
import PeriodActionItem from './PeriodActionItem';

const SmallIconButtonGroup = styled(IconButtonGroup)`
  padding-right: 1rem;
  font-size: ${({ theme }) => theme.shared.fontSize};
`;

const AddActionToPeriodFormWrapper = styled.div`
  margin-left: 5.6rem;
  margin-top: 0.8rem;
`;

const StyledButton = styled(Button)`margin-left: 3.2rem;`;

const Header = styled.span`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
`;

const Partition = styled.div`
  height: 1px;
  border-top: 1px solid rgba(180, 188, 255, 0.6);
  flex-grow: 1;
`;

const PeriodActionItemWrapper = styled.div`margin-left: 2.4rem;`;

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
  period: PeriodItem_periodFragment;
  queryVariables: PeriodPageQueryVariables;
}

type Props = OwnProps & {
  updateDescription(description: string): void;
  moveActionToPeriod(actionId: string, periodId: string): void;
  removePeriod(): void;
  removeAction(action: PeriodActionItem_actionFragment): void;
  connectDropTarget: ConnectDropTarget;
  isOver: boolean;
};

export function PeriodItem({
  removePeriod,
  period,
  removeAction,
  connectDropTarget,
  updateDescription,
  isOver,
}: Props) {
  const hasAction = period.actions && period.actions.length;

  return connectDropTarget(
    <div>
      <Wrapper isOver={isOver}>
        <Header>
          {period.position != null && (
            <TimeLabel activated position={period.position} />
          )}
          <Partition />
          {!hasAction && (
            <SmallIconButtonGroup>
              <RemoveButton onClick={removePeriod} />
            </SmallIconButtonGroup>
          )}
        </Header>
        {period.actions &&
          period.actions.map(
            action =>
              action && (
                <PeriodActionItemWrapper key={action.id}>
                  <PeriodActionItem action={action} remove={removeAction} />
                </PeriodActionItemWrapper>
              ),
          )}
        <AddActionToPeriodFormWrapper>
          <AddActionToPeriodForm period={period} />
        </AddActionToPeriodFormWrapper>
      </Wrapper>
    </div>,
  );
}

const actionTarget: DropTargetSpec<Props> = {
  drop: ({ period, moveActionToPeriod }, monitor) => {
    if (!monitor || !period) {
      return;
    }

    if (monitor.didDrop()) {
      return;
    }

    const { actionId } = monitor.getItem() as any;
    if (
      period.actions &&
      period.actions.find(action => !!action && action.id === actionId)
    ) {
      return { canMove: false };
    }

    moveActionToPeriod(actionId, period.id);

    return { canMove: true, toPeriodId: period.id };
  },
};

const withData = compose(
  graphql<Response, OwnProps, Props>(RemovePeriodAction.mutation, {
    props: ({ mutate, ownProps: { period, queryVariables } }) => ({
      removeAction: (action: PeriodActionItem_actionFragment) =>
        mutate &&
        mutate(
          RemovePeriodAction.build(
            { actionId: action.id },
            queryVariables,
            period,
          ),
        ),
    }),
  }),
  graphql<Response, OwnProps, Props>(RemovePeriod.mutation, {
    props: ({ mutate, ownProps: { date, period, queryVariables } }) => ({
      removePeriod: (title: string) =>
        mutate &&
        mutate(RemovePeriod.build({ periodId: period.id }, queryVariables)),
    }),
  }),
  graphql<Response, OwnProps, Props>(UpdatePeriod.mutation, {
    props: ({ mutate, ownProps: { period, queryVariables } }) => ({
      updateDescription: (description: string) =>
        mutate &&
        mutate(
          UpdatePeriod.build(
            { description, periodId: period.id },
            queryVariables,
            period,
          ),
        ),
    }),
  }),
  graphql<Response, OwnProps, Props>(MoveActionToPeriod.mutation, {
    props: ({ mutate, ownProps: { queryVariables } }) => ({
      moveActionToPeriod: (actionId: string, periodId: string) =>
        mutate &&
        mutate(
          MoveActionToPeriod.build({ actionId, periodId }, queryVariables),
        ),
    }),
  }),
  DropTarget(ItemTypes.action, actionTarget, (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver({ shallow: true }),
  })),
);

export default withData(PeriodItem);
