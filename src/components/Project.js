import React from 'react';
import { createFragmentContainer, graphql } from 'react-relay';

function Project({ project }) {
  return <div>{project.title}</div>;
}

export default createFragmentContainer(Project, {
  project: graphql`
    fragment Project_project on Project {
      title
    }
  `,
});
