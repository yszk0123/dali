import React from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import TimeUnit from './TimeUnit';
import AddTimeUnitMutation from '../mutations/AddTimeUnitMutation';

export class TimeUnitList extends React.Component {
  _handleAddTimeUnitClick = event => {
    this._addTimeUnit();
  };

  _addTimeUnit() {
    AddTimeUnitMutation.commit(
      this.props.relay.environment,
      { title: 'hoge' },
      this.props.viewer,
    );
  }

  _renderTimeUnits() {
    const { viewer } = this.props;

    return viewer.timeUnits.edges.map(edge =>
      <li key={edge.node.id}>
        <TimeUnit timeUnit={edge.node} />
      </li>,
    );
  }

  render() {
    return (
      <div>
        <h1>TimeUnits</h1>
        <ul>{this._renderTimeUnits()}</ul>
        <button onClick={this._handleAddTimeUnitClick}>Add</button>
      </div>
    );
  }
}

export default createFragmentContainer(
  TimeUnitList,
  graphql`
    fragment TimeUnitList_viewer on User {
      id
      timeUnits(first: 100) @connection(key: "TimeUnitList_timeUnits") {
        edges {
          node {
            id
            ...TimeUnit_timeUnit
          }
        }
      }
    }
  `,
);
