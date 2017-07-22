/* @flow */
import React from 'react';
import styled from 'styled-components';
import { createFragmentContainer, graphql } from 'react-relay';
import { connect } from 'react-redux';
import RemoveTaskSetMutation from '../../graphql/mutations/RemoveTaskSetMutation';
import UpdateTaskSetMutation from '../../graphql/mutations/UpdateTaskSetMutation';
import openLinkProjectModal from '../../redux/actions/openLinkProjectModal';
import IconButton from './IconButton';
import TitlePlaceholder from './TitlePlaceholder';
import TitleInput from './TitleInput';

type Props = {
  taskSet: any,
  viewer: any,
  relay: any,
};

const Wrapper = styled.div`margin: 2.5rem;`;

export class TaskSetItem extends React.Component {
  props: Props;
  state: State;

  _handleRemoveButtonClick = (event: Event) => {
    this._remove();
  };

  _handleProjectTitleClick = () => {
    const { taskSet, onLinkProject } = this.props;

    onLinkProject({ taskSetId: taskSet.id });
  };

  _handleDoneChange = () => {
    this._toggleDone();
  };

  _handleTaskSetTitleChange = ({ title }) => {
    this._updateTitle(title);
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
    const { taskSet } = this.props;
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
      </Wrapper>
    );
  }
}

const mapDispatchToProps = {
  onLinkProject: openLinkProjectModal,
};

export default createFragmentContainer(
  connect(undefined, mapDispatchToProps)(TaskSetItem),
  graphql`
    fragment TaskSetItem_taskSet on TaskSet {
      id
      title
      done
      project {
        title
      }
    }

    fragment TaskSetItem_viewer on User {
      id
      ...LinkProjectModal_viewer
    }
  `,
);
