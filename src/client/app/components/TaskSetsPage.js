import React from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import TaskSetList from './TaskSetList';

export function TaskSetsPage({ viewer }) {
  return <TaskSetList viewer={viewer} />;
}

export default createFragmentContainer(
  TaskSetsPage,
  graphql`
    fragment TaskSetsPage_viewer on User {
      ...TaskSetList_viewer
    }
  `,
);
