import React from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import Project from './Project';

export function ProjectList({ viewer }) {
  return (
    <div>
      <h1>Projects</h1>
      <ul>
        {viewer.projects.edges.map(edge =>
          <li key={edge.node.id}>
            <Project project={edge.node} />
          </li>,
        )}
      </ul>
    </div>
  );
}

export default createFragmentContainer(
  ProjectList,
  graphql`
    fragment ProjectList_viewer on User {
      projects(first: 100) {
        edges {
          node {
            id
            ...Project_project
          }
        }
      }
    }
  `,
);
