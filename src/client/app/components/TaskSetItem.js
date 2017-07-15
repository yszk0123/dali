/* @flow */
import React from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import RemoveTaskSetMutation from '../../graphql/mutations/RemoveTaskSetMutation';
import UpdateTaskSetTitleModal from './UpdateTaskSetTitleModal';
import LinkProjectModal from './LinkProjectModal';

type Props = {
  taskSet: any,
  viewer: any,
  relay: any,
};

type State = {
  isLinkProjectModalOpen: boolean,
};

export class TaskSetItem extends React.Component {
  props: Props;
  state: State;

  constructor(props: Props) {
    super(props);
    this.state = {
      isLinkProjectModalOpen: false,
      isUpdateTaskSetTitleModalOpen: false,
    };
  }

  _handleRemoveButtonClick = (event: Event) => {
    this._remove();
  };

  _handleLinkProjectButtonClick = () => {
    this.setState({ isLinkProjectModalOpen: true });
  };

  _handleUpdateTaskSetTitleButtonClick = () => {
    this.setState({ isUpdateTaskSetTitleModalOpen: true });
  };

  _handleModalClose = () => {
    this.setState({
      isLinkProjectModalOpen: false,
      isUpdateTaskSetTitleModalOpen: false,
    });
  };

  _remove() {
    RemoveTaskSetMutation.commit(
      this.props.relay.environment,
      this.props.taskSet,
      this.props.viewer,
    );
  }

  render() {
    const { taskSet, viewer } = this.props;
    const {
      isLinkProjectModalOpen,
      isUpdateTaskSetTitleModalOpen,
    } = this.state;
    const projectTitle = taskSet.project && taskSet.project.title;

    return (
      <div>
        <span>
          {taskSet.title}
        </span>
        {projectTitle &&
          <span>
            ({projectTitle})
          </span>}
        <button onClick={this._handleRemoveButtonClick}>Remove</button>
        <button onClick={this._handleLinkProjectButtonClick}>
          Link Project
        </button>
        <button onClick={this._handleUpdateTaskSetTitleButtonClick}>
          Update Title
        </button>
        <LinkProjectModal
          isOpen={isLinkProjectModalOpen}
          onRequestClose={this._handleModalClose}
          taskSet={taskSet}
          viewer={viewer}
        />
        <UpdateTaskSetTitleModal
          isOpen={isUpdateTaskSetTitleModalOpen}
          onRequestClose={this._handleModalClose}
          taskSet={taskSet}
        />
      </div>
    );
  }
}

export default createFragmentContainer(
  TaskSetItem,
  graphql`
    fragment TaskSetItem_taskSet on TaskSet {
      id
      title
      project {
        title
      }
      ...LinkProjectModal_taskSet
      ...UpdateTaskSetTitleModal_taskSet
    }

    fragment TaskSetItem_viewer on User {
      id
      ...LinkProjectModal_viewer
    }
  `,
);