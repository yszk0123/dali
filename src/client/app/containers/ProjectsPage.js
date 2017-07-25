import React from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import ProjectList from './ProjectList';

export function ProjectsPage({ viewer }) {
  return <ProjectList viewer={viewer} />;
}

export default createFragmentContainer(
  ProjectsPage,
  graphql`
    fragment ProjectsPage_viewer on User {
      ...ProjectList_viewer
    }
  `,
);
