import * as React from 'react';
import styled from 'styled-components';
import { graphql, compose, QueryProps, ChildProps } from 'react-apollo';
import { ProjectItem_projectFragment } from 'schema';
import Icon from '../components/Icon';
import TitleInput from '../components/TitleInput';
import RemoveProjectMutation from '../../graphql/mutations/RemoveProjectMutation';
import UpdateProjectMutation from '../../graphql/mutations/UpdateProjectMutation';

const Wrapper = styled.div`margin: 2.5rem;`;

type OwnProps = {
  project: ProjectItem_projectFragment;
};

interface ProjectItemProps {
  remove(): void;
  updateTitle(_: { title: string }): void;
}

type Props = QueryProps & OwnProps & ProjectItemProps;

export function ProjectItem({ project, remove, updateTitle }: Props) {
  return (
    <Wrapper>
      <TitleInput title={project.title} onChange={updateTitle} /> {' '}
      <Icon icon="trash" onClick={remove} />
    </Wrapper>
  );
}

const withData = compose(
  graphql<Response, OwnProps, Props>(RemoveProjectMutation.query, {
    props: ({ mutate, ownProps: { project } }) => ({
      remove: () =>
        RemoveProjectMutation.commit(mutate, {
          projectId: project.id,
        }),
    }),
  }),
  graphql<Response, OwnProps, Props>(UpdateProjectMutation.query, {
    props: ({ mutate, ownProps: { project } }) => ({
      updateTitle: (input: { title: string }) =>
        UpdateProjectMutation.commit(mutate, input, project),
    }),
  }),
);

export default withData(ProjectItem);
