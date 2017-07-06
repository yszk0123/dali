/* @flow */
import React from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import CreateProjectMutation from '../../graphql/mutations/CreateProjectMutation';
import getNodesFromConnection from '../../shared/utils/getNodesFromConnection';
import ProjectItem from './ProjectItem';
import type { ProjectList_viewer } from './__generated__/ProjectList_viewer.graphql';

type Props = {
  viewer: ProjectList_viewer,
  relay: any,
};

export class ProjectList extends React.Component {
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
      this._addProject(title);
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

  _addProject(title: string) {
    CreateProjectMutation.commit(
      this.props.relay.environment,
      { title },
      this.props.viewer,
    );
  }

  _renderProjects() {
    const { viewer } = this.props;

    return getNodesFromConnection(viewer.projects).map(project =>
      <li key={project.id}>
        <ProjectItem project={project} viewer={viewer} />
      </li>,
    );
  }

  render() {
    const { title } = this.state;

    return (
      <div>
        <h1>Projects</h1>
        <ul>
          {this._renderProjects()}
        </ul>
        <input type="text" value={title} onChange={this._handleTitleChange} />
        <button onClick={this._handleAddProjectClick}>Add</button>
      </div>
    );
  }
}

export default createFragmentContainer(
  ProjectList,
  graphql.experimental`
    fragment ProjectList_viewer on User
      @argumentDefinitions(count: { type: "Int", defaultValue: 100 }) {
      id
      projects(first: $count) @connection(key: "ProjectList_projects") {
        edges {
          node {
            id
            ...ProjectItem_project
          }
        }
      }
      ...ProjectItem_viewer
    }
  `,
);
