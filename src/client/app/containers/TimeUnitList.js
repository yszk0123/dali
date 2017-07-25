import React from 'react';
import styled from 'styled-components';
import { createFragmentContainer, graphql } from 'react-relay';
import getNodesFromConnection from '../../shared/utils/getNodesFromConnection.js';
import NoUserSelectArea from '../components/NoUserSelectArea';
import EmptyTimeUnitItem from './EmptyTimeUnitItem';
import TimeUnitItem from './TimeUnitItem';

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

function getSparseTimeUnits(timeUnits) {
  const sparseTimeUnits = Array.from(Array(MAX_TIME_UNITS));

  timeUnits.forEach(timeUnit => {
    sparseTimeUnits[timeUnit.position] = timeUnit;
  });

  return sparseTimeUnits;
}

export class TimeUnitList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      position: '',
    };
  }

  _renderTimeUnits() {
    const { dailySchedule, viewer } = this.props;
    const timeUnits = getSparseTimeUnits(
      getNodesFromConnection(dailySchedule.timeUnits),
    );

    return timeUnits.map((timeUnit, position) =>
      <ListItem key={position}>
        {timeUnit
          ? <TimeUnitItem
              timeUnit={timeUnit}
              viewer={viewer}
              dailySchedule={dailySchedule}
            />
          : <EmptyTimeUnitItem
              position={position}
              dailySchedule={dailySchedule}
            />}
      </ListItem>,
    );
  }

  render() {
    return (
      <NoUserSelectArea>
        <List>
          {this._renderTimeUnits()}
        </List>
      </NoUserSelectArea>
    );
  }
}

export default createFragmentContainer(
  TimeUnitList,
  graphql.experimental`
    fragment TimeUnitList_dailySchedule on DailySchedule
      @argumentDefinitions(count: { type: "Int", defaultValue: 100 }) {
      id
      timeUnits(first: $count) @connection(key: "TimeUnitList_timeUnits") {
        edges {
          node {
            id
            position
            ...TimeUnitItem_timeUnit
          }
        }
      }
      ...EmptyTimeUnitItem_dailySchedule
      ...TimeUnitItem_dailySchedule
    }

    fragment TimeUnitList_viewer on User {
      ...TimeUnitItem_viewer
    }
  `,
);
