import React from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import FocusedTimeUnitItem from './FocusedTimeUnitItem';

export function DashboardPage({ viewer }) {
  return <FocusedTimeUnitItem viewer={viewer} />;
}

export default createFragmentContainer(
  DashboardPage,
  graphql.experimental`
    fragment DashboardPage_viewer on User {
      ...FocusedTimeUnitItem_viewer
    }
  `,
);
