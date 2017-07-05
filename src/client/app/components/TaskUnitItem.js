/* @flow */
import React from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import RemoveTaskUnitMutation from '../../graphql/mutations/RemoveTaskUnitMutation';
import type { TaskUnitItem_taskUnit } from './__generated__/TaskUnitItem_taskUnit.graphql';
import type { TaskUnitItem_viewer } from './__generated__/TaskUnitItem_viewer.graphql';

type Props = {
  taskUnit: TaskUnitItem_taskUnit,
  viewer: TaskUnitItem_viewer,
  relay: any,
};

export class TaskUnitItem extends React.Component {
  props: Props;

  _handleRemoveButtonClick = (event: Event) => {
    this._remove();
  };

  _remove() {
    RemoveTaskUnitMutation.commit(
      this.props.relay.environment,
      this.props.taskUnit,
      this.props.viewer,
    );
  }

  render() {
    const { taskUnit } = this.props;

    return (
      <div>
        <span>
          {taskUnit.title}
        </span>
        <button onClick={this._handleRemoveButtonClick}>Remove</button>
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
    }

    fragment TaskUnitItem_viewer on User {
      id
    }
  `,
);
