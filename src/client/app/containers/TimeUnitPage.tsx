import * as React from 'react';
import { graphql, compose, QueryProps, ChildProps } from 'react-apollo';
import { TimeUnitPageQuery, TimeUnitItem_timeUnitFragment } from 'schema';
import * as timeUnitPageQuery from '../../graphql/querySchema/TimeUnitPage.graphql';
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
    if (timeUnit && timeUnit.position != null) {
      sparseTimeUnits[timeUnit.position] = timeUnit;
    }
  });

  return sparseTimeUnits;
}

interface OwnProps {
  date: DateOnly;
}

type Props = QueryProps & TimeUnitPageQuery & OwnProps;

export function TimeUnitPage({
  date,
  timeUnits,
  loading,
  phases,
  tasks,
}: Props) {
  if (loading || !phases || !tasks) {
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
                    tasks={tasks}
                  />
                : <EmptyTimeUnitItem date={date} position={position} />}
            </ListItem>,
          )}
      </List>
    </NoUserSelectArea>
  );
}

const withData = compose(
  graphql<Response & TimeUnitPageQuery, OwnProps, Props>(timeUnitPageQuery, {
    options: ({ date }) => ({
      variables: { date },
    }),
    props: ({ data }) => ({
      ...data,
      loading: data && (data.loading || !data.timeUnits),
    }),
  }),
);

export default withData(TimeUnitPage);
