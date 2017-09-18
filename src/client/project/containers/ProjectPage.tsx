import * as React from 'react';
import { graphql, compose, QueryProps, ChildProps } from 'react-apollo';
import { ProjectPageQuery as Query } from 'schema';
import * as QUERY from '../querySchema/ProjectPage.graphql';
import { CreateProject } from '../mutations';
import { styled } from '../../shared/styles';
import { Button, TitleInput } from '../../shared/components';
import ProjectItem from './ProjectItem';

const Wrapper = styled.div`font-size: 1.6rem;`;

const StyledProjectItem = styled(ProjectItem)`margin: 1rem;`;

const TitleInputWrapper = styled.div`margin: 1.6rem 0.8rem;`;

type Data = Response & Query;

interface OwnProps {}

type Props = QueryProps &
  Query & {
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
  graphql<Data, OwnProps, Props>(QUERY, {
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
