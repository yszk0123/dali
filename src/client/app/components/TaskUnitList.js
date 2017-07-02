import React from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import AddTaskUnitMutation from '../../graphql/mutations/AddTaskUnitMutation';
import TaskUnitItem from './TaskUnitItem';

export class TaskUnitList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
    };
  }

  _handleAddTaskUnitClick = event => {
    const { title } = this.state;

    if (title) {
      this._addTaskUnit(title);
      this.setState({
        title: '',
      });
    }
  };

  _handleTitleChange = event => {
    this.setState({
      title: event.target.value,
    });
  };

  _addTaskUnit(title) {
    AddTaskUnitMutation.commit(
      this.props.relay.environment,
      { title },
      this.props.viewer,
    );
  }

  _renderTaskUnits() {
    const { viewer } = this.props;

    return viewer.taskUnits.edges.map(edge =>
      <li key={edge.node.id}>
        <TaskUnitItem taskUnit={edge.node} />
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
        <button onClick={this._handleAddTaskUnitClick}>Add</button>
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
    }
  `,
);
