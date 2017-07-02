import React from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import TimeUnitList from './TimeUnitList';

export function TodayPage({ viewer }) {
  return <TimeUnitList viewer={viewer} />;
}

export default createFragmentContainer(
  TodayPage,
  graphql`
    fragment TodayPage_viewer on User {
      dailySchedule {
        date
        ...TimeUnitList_dailySchedule
      }
    }
  `,
);