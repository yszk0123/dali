import * as React from 'react';
import { graphql, compose, QueryProps, ChildProps } from 'react-apollo';
import { ProjectPageQuery } from 'schema';
import * as PROJECT_PAGE_QUERY from '../querySchema/ProjectPage.graphql';
import { CreateProject } from '../mutations';
import styled from '../../shared/styles/StyledComponents';
import TitleInput from '../../shared/components/TitleInput';
import Button from '../../shared/components/Button';
import ProjectItem from './ProjectItem';

const Wrapper = styled.div`font-size: 1.6rem;`;

const StyledProjectItem = styled(ProjectItem)`margin: 1rem;`;

const TitleInputWrapper = styled.div`margin: 1.6rem 0.8rem;`;

type Data = Response & ProjectPageQuery;

interface OwnProps {}

type Props = QueryProps &
  ProjectPageQuery & {
    isLogin: boolean;
    createProject(title: string): void;
  };

interface State {}

export class ProjectPage extends React.Component<
  ChildProps<Props, Response>,
  State
> {
  private renderProjects() {
    const { projects, groups } = this.props;

    return (
      projects &&
      projects.map(
        project =>
          project && (
            <StyledProjectItem
              key={project.id}
              project={project}
              groups={groups || []}
            />
          ),
      )
    );
  }

  render() {
    const { isLogin, createProject } = this.props;

    if (!isLogin) {
      return <span>Loading...</span>;
    }

    return (
      <Wrapper>
        <div>{this.renderProjects()}</div>
        <TitleInputWrapper>
          <TitleInput
            defaultLabel="New Project"
            title=""
            fullWidth
            onChange={createProject}
          />
        </TitleInputWrapper>
      </Wrapper>
    );
  }
}

const withData = compose(
  graphql<Data, OwnProps, Props>(PROJECT_PAGE_QUERY, {
    options: {
      fetchPolicy: 'network-only',
    },
    props: ({ data }) => ({
      ...data,
      isLogin: data && data.currentUser,
    }),
  }),
  graphql<Data, OwnProps, Props>(CreateProject.mutation, {
    props: ({ mutate }) => ({
      createProject: (title: string) =>
        mutate && mutate(CreateProject.build({ title })),
    }),
  }),
);

export default withData(ProjectPage);
