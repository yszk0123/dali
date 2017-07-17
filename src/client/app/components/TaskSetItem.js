/* @flow */
import React from 'react';
import styled from 'styled-components';
import { createFragmentContainer, graphql } from 'react-relay';
import RemoveTaskSetMutation from '../../graphql/mutations/RemoveTaskSetMutation';
import UpdateTaskSetMutation from '../../graphql/mutations/UpdateTaskSetMutation';
import UpdateTaskSetTitleModal from './UpdateTaskSetTitleModal';
import LinkProjectModal from './LinkProjectModal';
import IconButton from './IconButton';

type Props = {
  taskSet: any,
  viewer: any,
  relay: any,
};

type State = {
  isLinkProjectModalOpen: boolean,
};

const Wrapper = styled.div`margin: 2.5rem;`;

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

  _handleDoneChange = () => {
    this._toggleDone();
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

  _toggleDone() {
    const { relay, taskSet } = this.props;

    UpdateTaskSetMutation.commit(
      relay.environment,
      { done: !taskSet.done },
      taskSet,
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
      <Wrapper>
        <input
          type="checkbox"
          checked={taskSet.done}
          onChange={this._handleDoneChange}
        />
        {taskSet.title}
        {projectTitle &&
          <span>
            ({projectTitle})
          </span>}
        <IconButton
          icon="times"
          label="Remove"
          onClick={this._handleRemoveButtonClick}
        />
        <IconButton
          icon="plus"
          label="Link Project"
          onClick={this._handleLinkProjectButtonClick}
        />
        <IconButton
          icon="edit"
          label="Update Title"
          onClick={this._handleUpdateTaskSetTitleButtonClick}
        />
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
      </Wrapper>
    );
  }
}

export default createFragmentContainer(
  TaskSetItem,
  graphql`
    fragment TaskSetItem_taskSet on TaskSet {
      id
      title
      done
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
