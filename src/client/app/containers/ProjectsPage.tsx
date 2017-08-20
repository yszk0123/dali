import * as React from 'react';
import { graphql, compose, QueryProps, ChildProps } from 'react-apollo';
import { ProjectsPageQuery } from 'schema';
import * as projectsPageQuery from '../../graphql/querySchema/ProjectsPage.graphql';
import * as CreateProjectMutation from '../../graphql/mutations/CreateProjectMutation';
import Button from '../components/Button';
import ProjectItem from './ProjectItem';

interface ProjectsPageProps {
  isLogin: boolean;
  createProject(title: string): void;
}

type Props = QueryProps & ProjectsPageQuery & ProjectsPageProps;

interface State {
  title: string;
}

export class ProjectsPage extends React.Component<
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
    const { projects } = this.props;

    return projects.map(project =>
      <div key={project.id}>
        <ProjectItem project={project} />
      </div>,
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
        <h1>Projects</h1>
        <div>
          {this.renderProjects()}
        </div>
        <input type="text" value={title} onChange={this.handleTitleChange} />
        <Button onClick={this.handleAddProjectClick}>Add</Button>
      </div>
    );
  }
}

const withData = compose(
  graphql<Response & ProjectsPageQuery, {}, Props>(projectsPageQuery, {
    props: ({ data }) => ({
      ...data,
      isLogin: data && data.currentUser,
    }),
  }),
  graphql<
    Response & ProjectsPageQuery,
    {},
    Props
  >(CreateProjectMutation.mutation, {
    props: ({ mutate }) => ({
      createProject: (title: string) =>
        mutate(CreateProjectMutation.buildMutationOptions({ title })),
    }),
  }),
);

export default withData(ProjectsPage);
