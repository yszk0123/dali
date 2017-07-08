/* @flow */
import React from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import TimeUnitList from './TimeUnitList';
import type { TodayPage_viewer } from './__generated__/TodayPage_viewer.graphql';

type Props = {
  scheduleDate: Date,
  viewer: TodayPage_viewer,
};

export function TodayPage({ scheduleDate, viewer }: Props) {
  return <TimeUnitList viewer={viewer} scheduleDate={scheduleDate} />;
}

export default createFragmentContainer(
  TodayPage,
  graphql`
    fragment TodayPage_viewer on User {
      ...TimeUnitList_viewer
    }
  `,
);
