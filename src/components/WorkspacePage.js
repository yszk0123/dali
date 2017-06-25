import React from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import TaskUnitList from './TaskUnitList';

export function WorkspacePage({ viewer }) {
  return <TaskUnitList viewer={viewer} />;
}

export default createFragmentContainer(
  WorkspacePage,
  graphql`
    fragment WorkspacePage_viewer on User {
      ...TaskUnitList_viewer
    }
  `,
);
