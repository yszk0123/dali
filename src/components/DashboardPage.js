import React from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import TimeUnitList from './TimeUnitList';

export function DashboardPage({ viewer }) {
  return (
    <div>
      <h1>Hello, {viewer.name}!</h1>
      <TimeUnitList viewer={viewer} />
    </div>
  );
}

export default createFragmentContainer(
  DashboardPage,
  graphql`
    fragment DashboardPage_viewer on User {
      name
      ...TimeUnitList_viewer
    }
  `,
);
