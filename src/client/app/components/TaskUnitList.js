/* @flow */
import React from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import CreateTaskUnitMutation from '../../graphql/mutations/CreateTaskUnitMutation';
import getNodesFromConnection from '../../shared/utils/getNodesFromConnection';
import TaskUnitItem from './TaskUnitItem';
import type { TaskUnitList_viewer } from './__generated__/TaskUnitList_viewer.graphql';

type Props = {
  viewer: TaskUnitList_viewer,
  relay: any,
};

export class TaskUnitList extends React.Component {
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

  _handleLinkTaskUnitClick = (event: Event) => {
    const { title } = this.state;

    if (title) {
      this._linkTaskUnit(title);
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

  _linkTaskUnit(title: string) {
    CreateTaskUnitMutation.commit(
      this.props.relay.environment,
      { title },
      this.props.viewer,
    );
  }

  _renderTaskUnits() {
    const { viewer } = this.props;

    return getNodesFromConnection(viewer.taskUnits).map(taskUnit =>
      <li key={taskUnit.id}>
        <TaskUnitItem taskUnit={taskUnit} viewer={viewer} />
      </li>,
    );
  }

  render() {
    const { title } = this.state;

    return (
      <div>
        <h1>TaskUnits</h1>
        <ul>
          {this._renderTaskUnits()}
        </ul>
        <input type="text" value={title} onChange={this._handleTitleChange} />
        <button onClick={this._handleLinkTaskUnitClick}>Add</button>
      </div>
    );
  }
}

export default createFragmentContainer(
  TaskUnitList,
  graphql`
    fragment TaskUnitList_viewer on User {
      id
      taskUnits(first: 100) @connection(key: "TaskUnitList_taskUnits") {
        edges {
          node {
            id
            ...TaskUnitItem_taskUnit
          }
        }
      }
      ...TaskUnitItem_viewer
    }
  `,
);
