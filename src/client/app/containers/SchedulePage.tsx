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
  timeUnits: Array<TimeUnitItem_timeUnitFragment | null>,
): TimeUnitItem_timeUnitFragment[] {
  const sparseTimeUnits = Array.from(Array(MAX_TIME_UNITS));

  timeUnits.forEach(timeUnit => {
    if (timeUnit && timeUnit.position) {
      sparseTimeUnits[timeUnit.position] = timeUnit;
    }
  });

  return sparseTimeUnits;
}

interface OwnProps {
  date: DateOnly;
}

type Props = QueryProps & SchedulePageQuery & OwnProps;

export function SchedulePage({ date, timeUnits, loading, phases }: Props) {
  if (loading || !phases) {
    return null;
  }

  return (
    <NoUserSelectArea>
      <List>
        {timeUnits &&
          getSparseTimeUnits(timeUnits).map((timeUnit, position) =>
            <ListItem key={position}>
              {timeUnit
                ? <TimeUnitItem
                    date={date}
                    timeUnit={timeUnit}
                    phases={phases}
                  />
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
      loading: data && (data.loading || !data.timeUnits),
    }),
  }),
);

export default withData(SchedulePage);
