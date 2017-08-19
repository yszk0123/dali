/* @flow */
import React from 'react';
import { graphql, compose } from 'react-apollo';
import type { OperationComponent, QueryProps } from 'react-apollo';
import type { ProjectsPageQuery } from 'schema.graphql';
import projectsPageQuery from '../../graphql/querySchema/ProjectsPage.graphql';
import CreateProjectMutation from '../../graphql/mutations/CreateProjectMutation';
import Button from '../components/Button';
import ProjectItem from './ProjectItem';

type Props = {
  ...QueryProps,
  ...ProjectsPageQuery,
  isLogin: boolean,
};

export class ProjectsPage extends React.Component {
  props: Props;
  state: {
    title: string,
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      title: '',
    };
  }

  _handleAddProjectClick = (event: Event) => {
    const { title } = this.state;

    if (title) {
      this.props.createProject(title);
      this.setState({
        title: '',
      });
    }
  };

  _handleTitleChange = (event: Event) => {
    if (!(event.target instanceof HTMLInputElement)) {
      return;
    }

    this.setState({
      title: event.target.value,
    });
  };

  _renderProjects() {
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
          {this._renderProjects()}
        </div>
        <input type="text" value={title} onChange={this._handleTitleChange} />
        <Button onClick={this._handleAddProjectClick}>Add</Button>
      </div>
    );
  }
}

const withData: OperationComponent<ProjectsPageQuery, {}, Props> = compose(
  graphql(projectsPageQuery, {
    props: ({ data }) => ({
      ...data,
      isLogin: data && data.currentUser,
    }),
  }),
  graphql(CreateProjectMutation.query, {
    props: ({ mutate }) => ({
      createProject: title => CreateProjectMutation.commit(mutate, { title }),
    }),
  }),
);

export default withData(ProjectsPage);
