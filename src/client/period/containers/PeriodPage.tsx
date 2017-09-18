import * as React from 'react';
import { graphql, compose, QueryProps, ChildProps } from 'react-apollo';
import { RouteComponentProps } from 'react-router-dom';
import { subDays, addDays } from 'date-fns';
import {
  PeriodPageQuery,
  PeriodPageQueryVariables,
  PeriodItem_periodFragment,
} from 'schema';
import * as PERIOD_PAGE_QUERY from '../querySchema/PeriodPage.graphql';
import { styled } from '../../shared/styles';
import { DateSwitch } from '../../shared/components';
import { DateOnly } from '../../shared/interfaces';
import { getToday, toDaliDate } from '../../shared/utils';
import PeriodItem from './PeriodItem';
import EmptyPeriodItem from './EmptyPeriodItem';

const MAX_PERIODS = 48;

const List = styled.div`
  minwidth: 300px;
  display: flex;
  flex-direction: column;
`;

const ListItem = styled.div`
  margin: 0.4rem 0;
  align-content: center;
`;

type OwnProps = RouteComponentProps<any> & {
  queryVariables: PeriodPageQueryVariables;
};

type Props = QueryProps &
  OwnProps &
  PeriodPageQuery & {
    date: DateOnly;
  };

export function PeriodPage({ date, periods, loading, queryVariables }: Props) {
  if (loading) {
    return null;
  }
  const prev = toDaliDate(subDays(date, 1));
  const next = toDaliDate(addDays(date, 1));

  let wholeDay, times;

  if (periods) {
    const { wholeDayPeriod, sortedPeriods } = parsePeriods(periods);

    wholeDay = wholeDayPeriod ? (
      <PeriodItem
        date={date}
        period={wholeDayPeriod}
        queryVariables={queryVariables}
      />
    ) : (
      <EmptyPeriodItem date={date} position={null} />
    );

    times = sortedPeriods.map((period, position) => (
      <ListItem key={position}>
        {period ? (
          <PeriodItem
            date={date}
            period={period}
            queryVariables={queryVariables}
          />
        ) : (
          <EmptyPeriodItem date={date} position={position} />
        )}
      </ListItem>
    ));
  }

  return (
    <div>
      <DateSwitch
        date={date}
        previousLink={`/periods/${prev}`}
        nextLink={`/periods/${next}`}
      />
      <List>
        {wholeDay}
        {times}
      </List>
    </div>
  );
}

interface ParsedPeriods {
  wholeDayPeriod: PeriodItem_periodFragment | null;
  sortedPeriods: PeriodItem_periodFragment[];
}

function parsePeriods(
  periods: Array<PeriodItem_periodFragment | null>,
): ParsedPeriods {
  const sortedPeriods = Array.from(Array(MAX_PERIODS));
  let wholeDayPeriod = null;

  periods.forEach(period => {
    if (!period) {
      return;
    }
    if (period.position != null) {
      sortedPeriods[period.position] = period;
    } else {
      wholeDayPeriod = period;
    }
  });

  return { wholeDayPeriod, sortedPeriods };
}

const withData = compose(
  graphql<Response & PeriodPageQuery, OwnProps, Props>(PERIOD_PAGE_QUERY, {
    options: ({ match }) => ({
      variables: { date: match.params.date || getToday() },
      fetchPolicy: 'network-only',
    }),
    props: ({ data, ownProps: { match } }) => ({
      ...data,
      date: match.params.date || getToday(),
      loading: data && (data.loading || !data.periods),
      queryVariables: { date: match.params.date || getToday() },
    }),
  }),
);

export default withData(PeriodPage);
