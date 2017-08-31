import * as React from 'react';
import { graphql, compose, QueryProps, ChildProps } from 'react-apollo';
import { RouteComponentProps } from 'react-router-dom';
import { subDays, addDays } from 'date-fns';
import { TimeUnitPageQuery, TimeUnitItem_timeUnitFragment } from 'schema';
import * as timeUnitPageQuery from '../../graphql/querySchema/TimeUnitPage.graphql';
import styled from '../styles/StyledComponents';
import DateSwitch from '../components/DateSwitch';
import { DateOnly } from '../interfaces';
import toDaliDate from '../utils/toDaliDate';
import getToday from '../utils/getToday';
import TimeUnitItem from './TimeUnitItem';
import EmptyTimeUnitItem from './EmptyTimeUnitItem';

const MAX_TIME_UNITS = 48;

const List = styled.div`
  minWidth: 300px;
  display: flex;
  flex-direction: column;
`;

interface ListItemProps {
  highlightLine?: boolean;
}

const ListItem = styled.div`
  border-top: ${({ highlightLine }: ListItemProps) =>
    highlightLine ? '1px solid #ccc' : 'none'};
  margin: 0.4rem 0;
  align-content: center;
`;

type OwnProps = RouteComponentProps<any>;

type Props = QueryProps &
  TimeUnitPageQuery & {
    date: DateOnly;
  };

export function TimeUnitPage({ date, timeUnits, loading }: Props) {
  if (loading) {
    return null;
  }
  const prev = toDaliDate(subDays(date, 1));
  const next = toDaliDate(addDays(date, 1));

  return (
    <div>
      <DateSwitch
        date={date}
        previousLink={`/timeUnit/${prev}`}
        nextLink={`/timeUnit/${next}`}
      />
      <List>
        {timeUnits &&
          getSparseTimeUnits(timeUnits).map((timeUnit, position) =>
            <ListItem key={position} highlightLine={!!timeUnit}>
              {timeUnit
                ? <TimeUnitItem date={date} timeUnit={timeUnit} />
                : <EmptyTimeUnitItem date={date} position={position} />}
            </ListItem>,
          )}
      </List>
    </div>
  );
}

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

const withData = compose(
  graphql<Response & TimeUnitPageQuery, OwnProps, Props>(timeUnitPageQuery, {
    options: ({ match }) => ({
      variables: { date: match.params.date || getToday() },
      fetchPolicy: 'network-only',
    }),
    props: ({ data, ownProps: { match } }) => ({
      ...data,
      date: match.params.date || getToday(),
      loading: data && (data.loading || !data.timeUnits),
    }),
  }),
);

export default withData(TimeUnitPage);
