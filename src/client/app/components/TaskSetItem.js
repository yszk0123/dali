/* @flow */
import React from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import RemoveTaskSetMutation from '../../graphql/mutations/RemoveTaskSetMutation';
import type { TaskSetItem_taskSet } from './__generated__/TaskSetItem_taskSet.graphql';
import type { TaskSetItem_viewer } from './__generated__/TaskSetItem_viewer.graphql';
import LinkProjectModal from './LinkProjectModal';

type Props = {
  taskSet: TaskSetItem_taskSet,
  viewer: TaskSetItem_viewer,
  relay: any,
};

type State = {
  isModalOpen: boolean,
};

export class TaskSetItem extends React.Component {
  props: Props;
  state: State;

  constructor(props: Props) {
    super(props);
    this.state = {
      isModalOpen: false,
    };
  }

  _handleRemoveButtonClick = (event: Event) => {
    this._remove();
  };

  _handleLinkProjectButtonClick = () => {
    this.setState({ isModalOpen: true });
  };

  _handleModalClose = () => {
    this.setState({ isModalOpen: false });
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
    const { isModalOpen } = this.state;
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
        <LinkProjectModal
          isOpen={isModalOpen}
          onClose={this._handleModalClose}
          taskSet={taskSet}
          viewer={viewer}
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
    }

    fragment TaskSetItem_viewer on User {
      id
      ...LinkProjectModal_viewer
    }
  `,
);
