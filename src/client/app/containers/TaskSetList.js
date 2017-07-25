/* @flow */
import React from 'react';
import { createRefetchContainer, graphql } from 'react-relay';
import CreateTaskSetMutation from '../../graphql/mutations/CreateTaskSetMutation';
import getNodesFromConnection from '../../shared/utils/getNodesFromConnection';
import TaskSetItem from './TaskSetItem';
import InputWithButton from '../components/InputWithButton';

type Props = {
  viewer: any,
  relay: any,
};

export class TaskSetList extends React.Component {
  props: Props;
  state: {
    done: boolean,
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      done: false,
    };
  }

  _handleTitleSubmit = ({ value, isChanged }) => {
    if (!isChanged || !value) {
      return;
    }

    this._createTaskSet(value);
  };

  _handleDoneChange = (event: Event) => {
    const done = !!event.target.checked;

    this.setState({ done }, () => {
      this.props.relay.refetch({ done }, null);
    });
  };

  _createTaskSet(title: string) {
    const { done } = this.state;

    CreateTaskSetMutation.commit(
      this.props.relay.environment,
      { title, done },
      this.props.viewer,
    );
  }

  _renderTaskSets() {
    const { viewer } = this.props;
    const taskSets = getNodesFromConnection(viewer.taskSets);

    return taskSets.map(taskSet =>
      <div key={taskSet.id}>
        <TaskSetItem taskSet={taskSet} viewer={viewer} />
      </div>,
    );
  }

  render() {
    const { done } = this.state;

    return (
      <div>
        <h1>TaskSets</h1>
        <label htmlFor="taskSetDone">Done: </label>
        <input type="checkbox" value={done} onChange={this._handleDoneChange} />
        <div>
          {this._renderTaskSets()}
        </div>
        <InputWithButton onSubmit={this._handleTitleSubmit} />
      </div>
    );
  }
}

export default createRefetchContainer(
  TaskSetList,
  graphql.experimental`
    fragment TaskSetList_viewer on User
      @argumentDefinitions(
        count: { type: "Int", defaultValue: 100 }
        done: { type: "Boolean", defaultValue: false }
      ) {
      id
      taskSets(first: $count, done: $done)
        @connection(key: "TaskSetList_taskSets") {
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
  graphql.experimental`
    query TaskSetListRefetchQuery($done: Boolean) {
      viewer {
        ...TaskSetList_viewer @arguments(done: $done)
      }
    }
  `,
);
