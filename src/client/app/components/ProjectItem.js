/* @flow */
import React from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import RemoveProjectMutation from '../../graphql/mutations/RemoveProjectMutation';
import type { ProjectItem_project } from './__generated__/ProjectItem_project.graphql';
import type { ProjectItem_viewer } from './__generated__/ProjectItem_viewer.graphql';
import UpdateProjectTitleModal from './UpdateProjectTitleModal';

type Props = {
  project: ProjectItem_project,
  viewer: ProjectItem_viewer,
  relay: any,
};

export class ProjectItem extends React.Component {
  props: Props;

  constructor(props: Props) {
    super(props);
    this.state = {
      isTitleModalOpen: false,
    };
  }

  _handleTitleButtonClick = () => {
    this.setState({ isTitleModalOpen: true });
  };

  _handleModalClose = () => {
    this.setState({
      isTitleModalOpen: false,
    });
  };

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
    const { isTitleModalOpen } = this.state;

    return (
      <div>
        <span>
          {project.title}
        </span>
        <button onClick={this._handleRemoveButtonClick}>Remove</button>
        <button onClick={this._handleTitleButtonClick}>Update Title</button>
        <UpdateProjectTitleModal
          isOpen={isTitleModalOpen}
          onRequestClose={this._handleModalClose}
          project={project}
        />
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
      ...UpdateProjectTitleModal_project
    }

    fragment ProjectItem_viewer on User {
      id
    }
  `,
);
