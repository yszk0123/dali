import * as React from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import TaskSetList from './TaskSetList';
import LinkProjectModal from './LinkProjectModal';

export function TaskSetsPage({ viewer }) {
  return (
    <div>
      <TaskSetList viewer={viewer} />
      <LinkProjectModal viewer={viewer} />
    </div>
  );
}

export default createFragmentContainer(
  TaskSetsPage,
  graphql`
    fragment TaskSetsPage_viewer on User {
      ...LinkProjectModal_viewer
      ...TaskSetList_viewer
    }
  `,
);
