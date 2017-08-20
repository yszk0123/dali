/**
 * TODO: Extract sharable components
 */
import * as React from 'react';
import styled from 'styled-components';
import { graphql, compose, QueryProps, ChildProps } from 'react-apollo';
import { TimeUnitItem_timeUnitFragment, TaskItem_taskFragment } from 'schema';
import Icon from '../components/Icon';
import TimeLabel from '../components/TimeLabel';
import { DateOnly } from '../interfaces';
import * as CreateTimeUnitMutation from '../../graphql/mutations/CreateTimeUnitMutation';

const Wrapper = styled.div`
  color: #888;
  cursor: pointer;
`;

interface OwnProps {
  date: DateOnly;
  position: number;
}

type Props = OwnProps & {
  create: React.MouseEventHandler<HTMLElement>;
};

export function EmptyTimeUnitItem({ create, position }: Props) {
  return (
    <Wrapper>
      <span onClick={create}>
        <Icon icon="plus" /> <TimeLabel position={position} />
      </span>
    </Wrapper>
  );
}

const withData = compose(
  graphql<Response, OwnProps, Props>(CreateTimeUnitMutation.mutation, {
    props: ({ mutate, ownProps: { date, position } }) => ({
      create: () =>
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
