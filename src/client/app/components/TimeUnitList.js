/* @flow */
import React from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import getNodesFromConnection from '../../shared/utils/getNodesFromConnection.js';
import EmptyTimeUnitItem from './EmptyTimeUnitItem';
import TimeUnitItem from './TimeUnitItem';
import type { TimeUnitList_viewer } from './__generated__/TimeUnitList_viewer.graphql';

const MAX_TIME_UNITS = 48;

function getSparseTimeUnits(timeUnits) {
  const sparseTimeUnits = Array.from(Array(MAX_TIME_UNITS));

  timeUnits.forEach(timeUnit => {
    sparseTimeUnits[timeUnit.position] = timeUnit;
  });

  return sparseTimeUnits;
}

type Props = {
  scheduleDate: Date,
  viewer: TimeUnitList_viewer,
};

export class TimeUnitList extends React.Component {
  props: Props;

  constructor(props: Props) {
    super(props);
    this.state = {
      position: '',
    };
  }

  _renderTimeUnits() {
    const { scheduleDate, viewer } = this.props;
    const timeUnits = getSparseTimeUnits(
      getNodesFromConnection(viewer.timeUnits),
    );

    return timeUnits.map((timeUnit, position) =>
      <li key={position}>
        {timeUnit
          ? <TimeUnitItem
              scheduleDate={scheduleDate}
              timeUnit={timeUnit}
              viewer={viewer}
            />
          : <EmptyTimeUnitItem
              position={position}
              scheduleDate={scheduleDate}
              viewer={viewer}
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
    fragment TimeUnitList_viewer on User {
      timeUnits(first: 100) @connection(key: "TimeUnitList_timeUnits") {
        edges {
          node {
            id
            position
            ...TimeUnitItem_timeUnit
          }
        }
      }
      ...TimeUnitItem_viewer
      ...EmptyTimeUnitItem_viewer
    }
  `,
);
