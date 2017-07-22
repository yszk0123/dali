/* @flow */
import React from 'react';
import styled from 'styled-components';
import { createFragmentContainer, graphql } from 'react-relay';
import RemoveTaskSetMutation from '../../graphql/mutations/RemoveTaskSetMutation';
import UpdateTaskSetMutation from '../../graphql/mutations/UpdateTaskSetMutation';
import LinkProjectModal from './LinkProjectModal';
import IconButton from './IconButton';
import TitlePlaceholder from './TitlePlaceholder';
import TitleInput from './TitleInput';

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
    };
  }

  _handleRemoveButtonClick = (event: Event) => {
    this._remove();
  };

  _handleProjectTitleClick = () => {
    this.setState({ isLinkProjectModalOpen: true });
  };

  _handleDoneChange = () => {
    this._toggleDone();
  };

  _handleTaskSetTitleChange = ({ title }) => {
    this._updateTitle(title);
  };

  _handleModalClose = () => {
    this.setState({
      isLinkProjectModalOpen: false,
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

  _updateTitle(title) {
    const { relay, taskSet } = this.props;

    UpdateTaskSetMutation.commit(relay.environment, { title }, taskSet);
  }

  render() {
    const { taskSet, viewer } = this.props;
    const { isLinkProjectModalOpen } = this.state;
    const projectTitle = taskSet.project && taskSet.project.title;

    return (
      <Wrapper>
        <input
          type="checkbox"
          checked={taskSet.done}
          onChange={this._handleDoneChange}
        />
        <TitleInput
          title={taskSet.title}
          onChange={this._handleTaskSetTitleChange}
        />{' '}
        (<TitlePlaceholder
          label={projectTitle}
          defaultLabel="No Project"
          onClick={this._handleProjectTitleClick}
        />)
        <IconButton
          icon="times"
          label="Remove"
          onClick={this._handleRemoveButtonClick}
        />
        <LinkProjectModal
          isOpen={isLinkProjectModalOpen}
          onRequestClose={this._handleModalClose}
          taskSet={taskSet}
          viewer={viewer}
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
    }

    fragment TaskSetItem_viewer on User {
      id
      ...LinkProjectModal_viewer
    }
  `,
);
