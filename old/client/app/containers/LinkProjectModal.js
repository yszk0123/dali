/* @flow */
import * as React from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import { connect } from 'react-redux';
import Modal from 'react-modal';
import LinkProjectMutation from '../../graphql/mutations/LinkProjectMutation';
import getNodesFromConnection from '../../shared/utils/getNodesFromConnection';
import closeLinkProjectModal from '../../redux/actions/closeLinkProjectModal';
import ModalTitle from '../components/ModalTitle';
import Icon from '../components/Icon';
import List from './List';
import ListItem from './ListItem';

interface Props {
  isOpen: boolean,
  onRequestClose: () => mixed,
  relay: any,
  phaseId: any,
  viewer: any,
}

export class LinkProjectModal extends React.Component {
  props: Props;

  _add(project) {
    const { relay, phaseId, onRequestClose } = this.props;

    LinkProjectMutation.commit(
      relay.environment,
      { project },
      { id: phaseId },
    );

    onRequestClose();
  }

  _renderProjects() {
    const { viewer } = this.props;
    const projects = getNodesFromConnection(viewer.projects);

    return projects.map(project =>
      <ListItem key={project.id}>
        {project.title} <Icon icon="plus" onClick={() => this._add(project)} />
      </ListItem>,
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
        <ModalTitle>Select Project To Link</ModalTitle>
        <List>
          {this._renderProjects()}
        </List>
      </Modal>
    );
  }
}

function mapStateToProps({ modals: { phaseId } }) {
  return {
    isOpen: phaseId != null,
    phaseId,
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
