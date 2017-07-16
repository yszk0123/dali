/* @flow */
import React from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import Modal from 'react-modal';
import LinkProjectMutation from '../../graphql/mutations/LinkProjectMutation';
import getNodesFromConnection from '../../shared/utils/getNodesFromConnection';
import Icon from './Icon';

type Props = {
  isOpen: boolean,
  onRequestClose: () => mixed,
  relay: any,
  taskSet: any,
  viewer: any,
};

export class LinkProjectModal extends React.Component {
  props: Props;

  _add(project) {
    const { relay, taskSet, onRequestClose } = this.props;

    LinkProjectMutation.commit(relay.environment, { project }, taskSet);

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

export default createFragmentContainer(
  LinkProjectModal,
  graphql.experimental`
    fragment LinkProjectModal_taskSet on TaskSet {
      id
    }

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
