import * as React from 'react';
import { graphql, compose, QueryProps, ChildProps } from 'react-apollo';
import { ProjectPageQuery } from 'schema';
import * as PROJECT_PAGE_QUERY from '../../graphql/querySchema/ProjectPage.graphql';
import * as CreateProjectMutation from '../../graphql/mutations/CreateProjectMutation';
import styled from '../styles/StyledComponents';
import TitleInput from '../components/TitleInput';
import Button from '../components/Button';
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
  graphql<Data, OwnProps, Props>(CreateProjectMutation.mutation, {
    props: ({ mutate }) => ({
      createProject: (title: string) =>
        mutate && mutate(CreateProjectMutation.buildMutationOptions({ title })),
    }),
  }),
);

export default withData(ProjectPage);
