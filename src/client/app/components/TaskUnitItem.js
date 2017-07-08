/* @flow */
import React from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import RemoveTaskUnitMutation from '../../graphql/mutations/RemoveTaskUnitMutation';
import type { TaskUnitItem_taskUnit } from './__generated__/TaskUnitItem_taskUnit.graphql';
import type { TaskUnitItem_viewer } from './__generated__/TaskUnitItem_viewer.graphql';
import LinkProjectModal from './LinkProjectModal';

type Props = {
  taskUnit: TaskUnitItem_taskUnit,
  viewer: TaskUnitItem_viewer,
  relay: any,
};

type State = {
  isModalOpen: boolean,
};

export class TaskUnitItem extends React.Component {
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
    RemoveTaskUnitMutation.commit(
      this.props.relay.environment,
      this.props.taskUnit,
      this.props.viewer,
    );
  }

  render() {
    const { taskUnit, viewer } = this.props;
    const { isModalOpen } = this.state;
    const projectTitle = taskUnit.project && taskUnit.project.title;

    return (
      <div>
        <span>
          {taskUnit.title}
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
          taskUnit={taskUnit}
          viewer={viewer}
        />
      </div>
    );
  }
}

export default createFragmentContainer(
  TaskUnitItem,
  graphql`
    fragment TaskUnitItem_taskUnit on TaskUnit {
      id
      title
      project {
        title
      }
      ...LinkProjectModal_taskUnit
    }

    fragment TaskUnitItem_viewer on User {
      id
      ...LinkProjectModal_viewer
    }
  `,
);
