/**
 * TODO: Extract sharable components
 */
import * as React from 'react';
import { graphql, compose, QueryProps, ChildProps } from 'react-apollo';
import {
  PeriodItem_periodFragment,
  TaskActionItem_actionFragment,
} from 'schema';
import { styled } from '../../shared/styles';
import TimeLabel from '../components/TimeLabel';
import { DateOnly } from '../../shared/interfaces';
import { CreatePeriod } from '../mutations';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 0 1rem;
  color: #888;
`;

const StyledTimeLabel = styled(TimeLabel)`margin-left: 0.8rem;`;

const Partition = styled.div`
  height: 1px;
  border-top: 1px solid rgba(221, 221, 238, 0.3);
  flex-grow: 1;
`;

interface OwnProps {
  date: DateOnly;
  position: number | null;
}

type Props = OwnProps & {
  create: React.MouseEventHandler<HTMLElement>;
};

export function EmptyPeriodItem({ create, position }: Props) {
  return (
    <Wrapper onClick={create}>
      {position == null ? 'Whole day' : <StyledTimeLabel position={position} />}
      <Partition />
    </Wrapper>
  );
}

const withData = compose(
  graphql<Response, OwnProps, Props>(CreatePeriod.mutation, {
    props: ({ mutate, ownProps: { date, position } }) => ({
      create: () =>
        mutate && mutate(CreatePeriod.build({ date, position }, { date })),
    }),
  }),
);

export default withData(EmptyPeriodItem);
