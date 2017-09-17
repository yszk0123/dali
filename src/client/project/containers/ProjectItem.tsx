import * as React from 'react';
import { graphql, compose, QueryProps, ChildProps } from 'react-apollo';
import { Link } from 'react-router-dom';
import {
  ProjectItem_projectFragment,
  ProjectItem_groupsFragment,
} from 'schema';
import { styled } from '../../shared/styles';
import { Icon, TitleInput, TitleSelect } from '../../shared/components';
import { RemoveProject, UpdateProject } from '../mutations';

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 1.6rem;
  padding: 0.4rem 1.2rem;
`;

const TitleInputWrapper = styled.span`flex-grow: 1;`;

type OwnProps = {
  project: ProjectItem_projectFragment;
  groups: (ProjectItem_groupsFragment | null)[];
};

interface ProjectItemProps {
  remove(): void;
  updateTitle(title: string): void;
  setGroup(groupId: string): void;
}

type Props = QueryProps & OwnProps & ProjectItemProps;

export function ProjectItem({
  project,
  groups,
  remove,
  updateTitle,
  setGroup,
}: Props) {
  return (
    <Wrapper>
      <Link to={`/projects/${project.id}/phases`}>
        <Icon icon="arrow-right" />
      </Link>
      <TitleSelect
        defaultLabel="Group"
        selectedId={project.group && project.group.id}
        onChange={setGroup}
        items={groups}
      />
      <TitleInputWrapper>
        <TitleInput title={project.title} onChange={updateTitle} />
      </TitleInputWrapper>
      <Icon icon="trash" onClick={remove} />
    </Wrapper>
  );
}

export default compose(
  graphql<Response, OwnProps>(RemoveProject.mutation, {
    props: ({ mutate, ownProps: { project } }) => ({
      remove: () =>
        mutate && mutate(RemoveProject.build({ projectId: project.id })),
    }),
  }),
  graphql<Response, OwnProps>(UpdateProject.mutation, {
    props: ({ mutate, ownProps: { project } }) => ({
      updateTitle: (title: string) =>
        mutate &&
        mutate(
          UpdateProject.build({ title, projectId: project.id }, {}, project),
        ),
      setGroup: (groupId: string) =>
        mutate &&
        mutate(
          UpdateProject.build({ groupId, projectId: project.id }, {}, project),
        ),
    }),
  }),
)(ProjectItem);
