import React from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import TimeUnitList from './TimeUnitList';

export function DailySchedulePage({ viewer }) {
  return <TimeUnitList viewer={viewer} dailySchedule={viewer.dailySchedule} />;
}

export default createFragmentContainer(
  DailySchedulePage,
  graphql`
    fragment DailySchedulePage_viewer on User {
      dailySchedule {
        date
        ...TimeUnitList_dailySchedule
      }
      ...TimeUnitList_viewer
    }
  `,
);
