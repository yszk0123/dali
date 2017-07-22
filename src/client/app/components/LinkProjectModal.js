/* @flow */
import React from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import { connect } from 'react-redux';
import Modal from 'react-modal';
import LinkProjectMutation from '../../graphql/mutations/LinkProjectMutation';
import getNodesFromConnection from '../../shared/utils/getNodesFromConnection';
import closeLinkProjectModal from '../../redux/actions/closeLinkProjectModal';
import Icon from './Icon';

type Props = {
  isOpen: boolean,
  onRequestClose: () => mixed,
  relay: any,
  taskSetId: any,
  viewer: any,
};

export class LinkProjectModal extends React.Component {
  props: Props;

  _add(project) {
    const { relay, taskSetId, onRequestClose } = this.props;

    LinkProjectMutation.commit(
      relay.environment,
      { project },
      { id: taskSetId },
    );

    onRequestClose();
  }

  _renderProjects() {
    const { viewer } = this.props;
    const projects = getNodesFromConnection(viewer.projects);

    return projects.map(project =>
      <li key={project.id}>
        {project.title} <Icon icon="plus" onClick={() => this._add(project)} />
      </li>,
    );
  }

  render() {
    const { isOpen, onRequestClose } = this.props;

    return (
      <Modal
        contentLabel="modal"
        isOpen={isOpen}
        onRequestClose={onRequestClose}
      >
        <h2>Projects</h2>
        <ul>
          {this._renderProjects()}
        </ul>
      </Modal>
    );
  }
}

function mapStateToProps({ modals: { taskSetId } }) {
  return {
    isOpen: taskSetId != null,
    taskSetId,
  };
}

const mapDispatchToProps = {
  onRequestClose: closeLinkProjectModal,
};

export default createFragmentContainer(
  connect(mapStateToProps, mapDispatchToProps)(LinkProjectModal),
  graphql.experimental`
    fragment LinkProjectModal_viewer on User
      @argumentDefinitions(count: { type: "Int", defaultValue: 100 }) {
      projects(first: $count) {
        edges {
          node {
            id
            title
          }
        }
      }
    }
  `,
);
