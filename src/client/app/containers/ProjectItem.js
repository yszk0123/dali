/* @flow */
import React from 'react';
import styled from 'styled-components';
import { graphql, compose } from 'react-apollo';
import type { OperationComponent, QueryProps } from 'react-apollo';
import type {
  ProjectItem_projectFragment,
  ProjectItem_currentUserFragment,
} from 'schema.graphql';
import Icon from '../components/Icon';
import TitleInput from '../components/TitleInput';
import RemoveProjectMutation from '../../graphql/mutations/RemoveProjectMutation';
import UpdateProjectMutation from '../../graphql/mutations/UpdateProjectMutation';

const Wrapper = styled.div`margin: 2.5rem;`;

type OwnProps = {
  project: ProjectItem_projectFragment,
  currentUser: ProjectItem_currentUserFragment,
};

type Props = {
  ...QueryProps,
  ...OwnProps,
  remove: () => mixed,
  updateTitle: ({ title: string }) => mixed,
};

export function ProjectItem({ project, remove, updateTitle }: Props) {
  return (
    <Wrapper>
      <TitleInput title={project.title} onChange={updateTitle} /> {' '}
      <Icon icon="trash" onClick={remove} />
    </Wrapper>
  );
}

const withData: OperationComponent<{}, OwnProps, Props> = compose(
  graphql(RemoveProjectMutation.query, {
    props: ({ mutate, ownProps: { project, currentUser } }) => ({
      remove: () =>
        RemoveProjectMutation.commit(mutate, {
          projectId: project.id,
          currentUser,
        }),
    }),
  }),
  graphql(UpdateProjectMutation.query, {
    props: ({ mutate, ownProps: { project, currentUser } }) => ({
      updateTitle: ({ title }) =>
        UpdateProjectMutation.commit(mutate, { title }, project),
    }),
  }),
);

export default withData(ProjectItem);
