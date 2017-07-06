/* @flow */
import React from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import RemoveProjectMutation from '../../graphql/mutations/RemoveProjectMutation';
import type { ProjectItem_project } from './__generated__/ProjectItem_project.graphql';
import type { ProjectItem_viewer } from './__generated__/ProjectItem_viewer.graphql';

type Props = {
  project: ProjectItem_project,
  viewer: ProjectItem_viewer,
  relay: any,
};

export class ProjectItem extends React.Component {
  props: Props;

  _handleRemoveButtonClick = (event: Event) => {
    this._remove();
  };

  _remove() {
    RemoveProjectMutation.commit(
      this.props.relay.environment,
      this.props.project,
      this.props.viewer,
    );
  }

  render() {
    const { project } = this.props;

    return (
      <div>
        <span>
          {project.title}
        </span>
        <button onClick={this._handleRemoveButtonClick}>Remove</button>
      </div>
    );
  }
}

export default createFragmentContainer(
  ProjectItem,
  graphql`
    fragment ProjectItem_project on Project {
      id
      title
    }

    fragment ProjectItem_viewer on User {
      id
    }
  `,
);
