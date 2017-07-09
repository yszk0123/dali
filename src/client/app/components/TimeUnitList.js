import React from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import getNodesFromConnection from '../../shared/utils/getNodesFromConnection.js';
import EmptyTimeUnitItem from './EmptyTimeUnitItem';
import TimeUnitItem from './TimeUnitItem';

const MAX_TIME_UNITS = 48;

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
      <li key={position}>
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
      </li>,
    );
  }

  render() {
    return (
      <div>
        <h1>TimeUnits</h1>
        <ul>
          {this._renderTimeUnits()}
        </ul>
      </div>
    );
  }
}

export default createFragmentContainer(
  TimeUnitList,
  graphql`
    fragment TimeUnitList_dailySchedule on DailySchedule {
      id
      timeUnits(first: 100) @connection(key: "TimeUnitList_timeUnits") {
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
