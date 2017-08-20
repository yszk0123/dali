import * as React from 'react';
import { graphql, compose, QueryProps, ChildProps } from 'react-apollo';
import { SchedulePageQuery, TimeUnitItem_timeUnitFragment } from 'schema';
import * as schedulePageQuery from '../../graphql/querySchema/SchedulePage.graphql';
import styled from '../styles/StyledComponents';
import NoUserSelectArea from '../components/NoUserSelectArea';
import { DateOnly } from '../interfaces';
// import AddTaskUnitModal from './AddTaskUnitModal';
import TimeUnitItem from './TimeUnitItem';
import EmptyTimeUnitItem from './EmptyTimeUnitItem';

const MAX_TIME_UNITS = 48;

const List = styled.div`
  minWidth: 300px;
  display: flex;
  flex-direction: column;
`;

const ListItem = styled.div`
  margin-bottom: 1rem;
  align-content: center;
`;

function getSparseTimeUnits(
  timeUnits: TimeUnitItem_timeUnitFragment[],
): TimeUnitItem_timeUnitFragment[] {
  const sparseTimeUnits = Array.from(Array(MAX_TIME_UNITS));

  timeUnits.forEach(timeUnit => {
    sparseTimeUnits[timeUnit.position] = timeUnit;
  });

  return sparseTimeUnits;
}

interface OwnProps {
  date: DateOnly;
}

type Props = QueryProps & SchedulePageQuery & OwnProps;

export function SchedulePage({ date, timeUnits, loading }: Props) {
  if (loading) {
    return null;
  }

  return (
    <NoUserSelectArea>
      <List>
        {getSparseTimeUnits(timeUnits).map((timeUnit, position) =>
          <ListItem key={position}>
            {timeUnit
              ? <TimeUnitItem date={date} timeUnit={timeUnit} />
              : <EmptyTimeUnitItem date={date} position={position} />}
          </ListItem>,
        )}
      </List>
    </NoUserSelectArea>
  );
}

const withData = compose(
  graphql<Response & SchedulePageQuery, OwnProps, Props>(schedulePageQuery, {
    options: ({ date }) => ({
      variables: { date },
    }),
    props: ({ data }) => ({
      ...data,
      loading: data.loading || !data.timeUnits,
    }),
  }),
);

export default withData(SchedulePage);
