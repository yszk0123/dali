/* @flow */
import type { Project_project } from './__generated__/Project_project.graphql';
import React from 'react';
import { createFragmentContainer, graphql } from 'react-relay';

type Props = { project: Project_project };
export function Project({ project }: Props) {
  return <div>{project.title}</div>;
}

export default createFragmentContainer(
  Project,
  graphql`
    fragment Project_project on Project {
      title
    }
  `,
);
