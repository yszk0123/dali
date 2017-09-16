import * as React from 'react';
import { graphql, compose, QueryProps, ChildProps } from 'react-apollo';
import { RouteComponentProps } from 'react-router-dom';
import { subDays, addDays } from 'date-fns';
import {
  TimeUnitPageQuery,
  TimeUnitPageQueryVariables,
  TimeUnitItem_timeUnitFragment,
} from 'schema';
import * as TIME_UNIT_PAGE_QUERY from '../querySchema/TimeUnitPage.graphql';
import styled from '../../shared/styles/StyledComponents';
import DateSwitch from '../../shared/components/DateSwitch';
import { DateOnly } from '../../app/interfaces';
import toDaliDate from '../../shared/utils/toDaliDate';
import getToday from '../../shared/utils/getToday';
import TimeUnitItem from './TimeUnitItem';
import EmptyTimeUnitItem from './EmptyTimeUnitItem';

const MAX_TIME_UNITS = 48;

const List = styled.div`
  minWidth: 300px;
  display: flex;
  flex-direction: column;
`;

const ListItem = styled.div`
  margin: 0.4rem 0;
  align-content: center;
`;

type OwnProps = RouteComponentProps<any> & {
  queryVariables: TimeUnitPageQueryVariables;
};

type Props = QueryProps &
  OwnProps &
  TimeUnitPageQuery & {
    date: DateOnly;
  };

export function TimeUnitPage({
  date,
  timeUnits,
  loading,
  queryVariables,
}: Props) {
  if (loading) {
    return null;
  }
  const prev = toDaliDate(subDays(date, 1));
  const next = toDaliDate(addDays(date, 1));

  let wholeDay, times;

  if (timeUnits) {
    const { wholeDayTimeUnit, sortedTimeUnits } = parseTimeUnits(timeUnits);

    wholeDay = wholeDayTimeUnit ? (
      <TimeUnitItem
        date={date}
        timeUnit={wholeDayTimeUnit}
        queryVariables={queryVariables}
      />
    ) : (
      <EmptyTimeUnitItem date={date} position={null} />
    );

    times = sortedTimeUnits.map((timeUnit, position) => (
      <ListItem key={position}>
        {timeUnit ? (
          <TimeUnitItem
            date={date}
            timeUnit={timeUnit}
            queryVariables={queryVariables}
          />
        ) : (
          <EmptyTimeUnitItem date={date} position={position} />
        )}
      </ListItem>
    ));
  }

  return (
    <div>
      <DateSwitch
        date={date}
        previousLink={`/timeUnits/${prev}`}
        nextLink={`/timeUnits/${next}`}
      />
      <List>
        {wholeDay}
        {times}
      </List>
    </div>
  );
}

interface ParsedTimeUnits {
  wholeDayTimeUnit: TimeUnitItem_timeUnitFragment | null;
  sortedTimeUnits: TimeUnitItem_timeUnitFragment[];
}

function parseTimeUnits(
  timeUnits: Array<TimeUnitItem_timeUnitFragment | null>,
): ParsedTimeUnits {
  const sortedTimeUnits = Array.from(Array(MAX_TIME_UNITS));
  let wholeDayTimeUnit = null;

  timeUnits.forEach(timeUnit => {
    if (!timeUnit) {
      return;
    }
    if (timeUnit.position != null) {
      sortedTimeUnits[timeUnit.position] = timeUnit;
    } else {
      wholeDayTimeUnit = timeUnit;
    }
  });

  return { wholeDayTimeUnit, sortedTimeUnits };
}

const withData = compose(
  graphql<Response & TimeUnitPageQuery, OwnProps, Props>(TIME_UNIT_PAGE_QUERY, {
    options: ({ match }) => ({
      variables: { date: match.params.date || getToday() },
      fetchPolicy: 'network-only',
    }),
    props: ({ data, ownProps: { match } }) => ({
      ...data,
      date: match.params.date || getToday(),
      loading: data && (data.loading || !data.timeUnits),
      queryVariables: { date: match.params.date || getToday() },
    }),
  }),
);

export default withData(TimeUnitPage);
