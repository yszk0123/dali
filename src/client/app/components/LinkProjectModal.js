/* @flow */
import React from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import Modal from 'react-modal';
import LinkProjectMutation from '../../graphql/mutations/LinkProjectMutation';
import getNodesFromConnection from '../../shared/utils/getNodesFromConnection';
import type { LinkProjectModal_taskSet } from './__generated__/LinkProjectModal_taskSet.graphql';
import type { LinkProjectModal_viewer } from './__generated__/LinkProjectModal_viewer.graphql';

type Props = {
  isOpen: boolean,
  onClose: () => mixed,
  relay: any,
  taskSet: LinkProjectModal_taskSet,
  viewer: LinkProjectModal_viewer,
};

export class LinkProjectModal extends React.Component {
  props: Props;

  _add(project) {
    const { relay, taskSet, onClose } = this.props;

    LinkProjectMutation.commit(relay.environment, { project }, taskSet);

    onClose();
  }

  _renderProjects() {
    const { viewer } = this.props;
    const projects = getNodesFromConnection(viewer.projects);

    return projects.map(project =>
      <li key={project.id}>
        <div>
          {project.title}
        </div>
        <button onClick={() => this._add(project)}>Add This</button>
      </li>,
    );
  }

  render() {
    const { isOpen, onClose } = this.props;

    return (
      <Modal contentLabel="modal" isOpen={isOpen} onRequestClose={onClose}>
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
