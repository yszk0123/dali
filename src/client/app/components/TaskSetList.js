/* @flow */
import React from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import CreateTaskSetMutation from '../../graphql/mutations/CreateTaskSetMutation';
import getNodesFromConnection from '../../shared/utils/getNodesFromConnection';
import TaskSetItem from './TaskSetItem';
import Button from './Button';

type Props = {
  viewer: any,
  relay: any,
};

export class TaskSetList extends React.Component {
  props: Props;
  state: {
    title: string,
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      title: '',
    };
  }

  _handleAddTaskUnitClick = (event: Event) => {
    const { title } = this.state;

    if (title) {
      this._linkTaskSet(title);
      this.setState({
        title: '',
      });
    }
  };

  _handleTitleChange = (event: Event) => {
    if (!(event.target instanceof HTMLInputElement)) {
      return;
    }

    this.setState({
      title: event.target.value,
    });
  };

  _linkTaskSet(title: string) {
    CreateTaskSetMutation.commit(
      this.props.relay.environment,
      { title },
      this.props.viewer,
    );
  }

  _renderTaskSets() {
    const { viewer } = this.props;

    return getNodesFromConnection(viewer.taskSets).map(taskSet =>
      <div key={taskSet.id}>
        <TaskSetItem taskSet={taskSet} viewer={viewer} />
      </div>,
    );
  }

  render() {
    const { title } = this.state;

    return (
      <div>
        <h1>TaskSets</h1>
        <div>
          {this._renderTaskSets()}
        </div>
        <input type="text" value={title} onChange={this._handleTitleChange} />
        <Button onClick={this._handleAddTaskUnitClick}>Add</Button>
      </div>
    );
  }
}

export default createFragmentContainer(
  TaskSetList,
  graphql.experimental`
    fragment TaskSetList_viewer on User
      @argumentDefinitions(count: { type: "Int", defaultValue: 100 }) {
      id
      taskSets(first: $count) @connection(key: "TaskSetList_taskSets") {
        edges {
          node {
            id
            ...TaskSetItem_taskSet
          }
        }
      }
      ...TaskSetItem_viewer
    }
  `,
);
