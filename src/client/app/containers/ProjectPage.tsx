import * as React from 'react';
import { graphql, compose, QueryProps, ChildProps } from 'react-apollo';
import { ProjectPageQuery } from 'schema';
import * as projectPageQuery from '../../graphql/querySchema/ProjectPage.graphql';
import * as CreateProjectMutation from '../../graphql/mutations/CreateProjectMutation';
import Button from '../components/Button';
import ProjectItem from './ProjectItem';

interface ProjectPageProps {
  isLogin: boolean;
  createProject(title: string): void;
}

type Props = QueryProps & ProjectPageQuery & ProjectPageProps;

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
    const { projects } = this.props;

    return (
      projects &&
      projects.map(
        project =>
          project &&
          <div key={project.id}>
            <ProjectItem project={project} />
          </div>,
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
  graphql<Response & ProjectPageQuery, {}, Props>(projectPageQuery, {
    props: ({ data }) => ({
      ...data,
      isLogin: data && data.currentUser,
    }),
  }),
  graphql<
    Response & ProjectPageQuery,
    {},
    Props
  >(CreateProjectMutation.mutation, {
    props: ({ mutate }) => ({
      createProject: (title: string) =>
        mutate && mutate(CreateProjectMutation.buildMutationOptions({ title })),
    }),
  }),
);

export default withData(ProjectPage);
