/* @flow */
import React from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import UpdateProjectMutation from '../../graphql/mutations/UpdateProjectMutation';
import UpdateTitleModal from './UpdateTitleModal';

type Props = {
  relay: any,
  project: any,
};

export class UpdateProjectTitleModal extends React.Component {
  props: Props;

  _handleTitleSubmit = ({ title }) => {
    const { relay, project, onRequestClose } = this.props;

    UpdateProjectMutation.commit(relay.environment, { title }, project);

    onRequestClose();
  };

  render() {
    const { isOpen, project, onRequestClose } = this.props;

    return (
      <UpdateTitleModal
        isOpen={isOpen}
        title={project.title}
        onRequestClose={onRequestClose}
        onSubmit={this._handleTitleSubmit}
      />
    );
  }
}

export default createFragmentContainer(
  UpdateProjectTitleModal,
  graphql.experimental`
    fragment UpdateProjectTitleModal_project on Project {
      id
      title
    }
  `,
);
