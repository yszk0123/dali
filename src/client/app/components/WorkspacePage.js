import React from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import TaskSetList from './TaskSetList';

export function WorkspacePage({ viewer }) {
  return <TaskSetList viewer={viewer} />;
}

export default createFragmentContainer(
  WorkspacePage,
  graphql`
    fragment WorkspacePage_viewer on User {
      ...TaskSetList_viewer
    }
  `,
);
