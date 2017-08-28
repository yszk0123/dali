/**
 * TODO: Extract sharable components
 */
import * as React from 'react';
import { graphql, compose, QueryProps, ChildProps } from 'react-apollo';
import { TimeUnitItem_timeUnitFragment, TaskItem_taskFragment } from 'schema';
import styled from '../styles/StyledComponents';
import Icon from '../components/Icon';
import TimeLabel from '../components/TimeLabel';
import { DateOnly } from '../interfaces';
import * as CreateTimeUnitMutation from '../../graphql/mutations/CreateTimeUnitMutation';

const Wrapper = styled.div`
  cursor: pointer;
  padding: 0 1rem;
  color: #888;
`;

const TimeLabelWrapper = styled.span`margin-left: 0.8rem;`;

interface OwnProps {
  date: DateOnly;
  position: number;
}

type Props = OwnProps & {
  create: React.MouseEventHandler<HTMLElement>;
};

export function EmptyTimeUnitItem({ create, position }: Props) {
  return (
    <Wrapper onClick={create}>
      <Icon icon="plus" />
      <TimeLabelWrapper>
        <TimeLabel position={position} />
      </TimeLabelWrapper>
    </Wrapper>
  );
}

const withData = compose(
  graphql<Response, OwnProps, Props>(CreateTimeUnitMutation.mutation, {
    props: ({ mutate, ownProps: { date, position } }) => ({
      create: () =>
        mutate &&
        mutate(
          CreateTimeUnitMutation.buildMutationOptions(
            { date, position },
            { date },
          ),
        ),
    }),
  }),
);

export default withData(EmptyTimeUnitItem);
