/* @flow */
import React from 'react';
import styled from 'styled-components';
import { createFragmentContainer, graphql } from 'react-relay';
import RemoveProjectMutation from '../../graphql/mutations/RemoveProjectMutation';
import UpdateProjectTitleModal from './UpdateProjectTitleModal';
import IconButton from './IconButton';

type Props = {
  project: any,
  viewer: any,
  relay: any,
};

const Wrapper = styled.div`margin: 2.5rem;`;

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
      <Wrapper>
        <span>
          {project.title}
        </span>
        <IconButton
          icon="trash"
          label="Remove"
          onClick={this._handleRemoveButtonClick}
        />
        <IconButton
          icon="edit"
          label="Update Title"
          onClick={this._handleTitleButtonClick}
        />
        <UpdateProjectTitleModal
          isOpen={isTitleModalOpen}
          onRequestClose={this._handleModalClose}
          project={project}
        />
      </Wrapper>
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
