import * as React from 'react';
import { graphql, compose, QueryProps, ChildProps } from 'react-apollo';
import { ProjectItem_projectFragment } from 'schema';
import styled from '../styles/StyledComponents';
import Icon from '../components/Icon';
import TitleInput from '../components/TitleInput';
import * as RemoveProjectMutation from '../../graphql/mutations/RemoveProjectMutation';
import * as UpdateProjectMutation from '../../graphql/mutations/UpdateProjectMutation';

const Wrapper = styled.div`padding: 0.4rem;`;

type OwnProps = {
  project: ProjectItem_projectFragment;
};

interface ProjectItemProps {
  remove(): void;
  updateTitle(title: string): void;
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
  graphql<Response, OwnProps, Props>(RemoveProjectMutation.mutation, {
    props: ({ mutate, ownProps: { project } }) => ({
      remove: () =>
        mutate &&
        mutate(
          RemoveProjectMutation.buildMutationOptions({ projectId: project.id }),
        ),
    }),
  }),
  graphql<Response, OwnProps, Props>(UpdateProjectMutation.mutation, {
    props: ({ mutate, ownProps: { project } }) => ({
      updateTitle: (title: string) =>
        mutate &&
        mutate(
          UpdateProjectMutation.buildMutationOptions(
            { title, projectId: project.id },
            {},
            project,
          ),
        ),
    }),
  }),
);

export default withData(ProjectItem);
