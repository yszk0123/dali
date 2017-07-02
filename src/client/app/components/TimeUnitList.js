import React from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import AddTimeUnitMutation from '../../graphql/mutations/AddTimeUnitMutation';
import TimeUnitItem from './TimeUnitItem';

export class TimeUnitList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
    };
  }

  _handleAddTimeUnitClick = event => {
    const { title } = this.state;

    if (title) {
      this._addTimeUnit(title);
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

  _addTimeUnit(title) {
    AddTimeUnitMutation.commit(
      this.props.relay.environment,
      { title },
      this.props.dailySchedule,
    );
  }

  _renderTimeUnits() {
    const { dailySchedule } = this.props;

    return dailySchedule.timeUnits.edges.map(edge =>
      <li key={edge.node.id}>
        <TimeUnitItem timeUnit={edge.node} />
      </li>,
    );
  }

  render() {
    const { title } = this.state;

    return (
      <div>
        <h1>TimeUnits</h1>
        <ul>
          {this._renderTimeUnits()}
        </ul>
        <input type="text" value={title} onChange={this._handleTitleChange} />
        <button onClick={this._handleAddTimeUnitClick}>Add</button>
      </div>
    );
  }
}

export default createFragmentContainer(
  TimeUnitList,
  graphql`
    fragment TimeUnitList_dailySchedule on DailySchedule {
      id
      timeUnits(first: 100) @connection(key: "TimeUnitList_timeUnits") {
        edges {
          node {
            id
            ...TimeUnitItem_timeUnit
          }
        }
      }
    }
  `,
);
