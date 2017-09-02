import * as React from 'react';
import { graphql, compose, QueryProps, ChildProps } from 'react-apollo';
import { ProjectPageQuery } from 'schema';
import * as PROJECT_PAGE_QUERY from '../../graphql/querySchema/ProjectPage.graphql';
import * as CreateProjectMutation from '../../graphql/mutations/CreateProjectMutation';
import styled from '../styles/StyledComponents';
import Button from '../components/Button';
import ProjectItem from './ProjectItem';

const StyledProjectItem = styled(ProjectItem)`margin: 1rem;`;

type Data = Response & ProjectPageQuery;

interface OwnProps {}

type Props = QueryProps &
  ProjectPageQuery & {
    isLogin: boolean;
    createProject(title: string): void;
  };

interface State {
  title: string;
}

export class ProjectPage extends React.Component<
  ChildProps<Props, Response>,
  State
> {
  state = { title: '' };

  private handleAddProjectClick = (event: React.MouseEvent<HTMLElement>) => {
    const { title } = this.state;

    if (title) {
      this.props.createProject(title);
      this.setState({
        title: '',
      });
    }
  };

  private handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      title: event.target.value,
    });
  };

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
    const { isLogin } = this.props;
    const { title } = this.state;

    if (!isLogin) {
      return <span>Loading...</span>;
    }

    return (
      <div>
        <div>{this.renderProjects()}</div>
        <div>
          <input type="text" value={title} onChange={this.handleTitleChange} />
          <Button onClick={this.handleAddProjectClick}>Add</Button>
        </div>
      </div>
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
