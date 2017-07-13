import React from 'react';
import { createRefetchContainer, graphql } from 'react-relay';
import getNodesFromConnection from '../../shared/utils/getNodesFromConnection';

export class DailyReportPage extends React.Component {
  _handleUpdateButtonClick = () => {
    this._update();
  };

  _update() {
    const refetchVariables = ({ count }) => ({ count });

    this.props.relay.refetch(refetchVariables, null);
  }

  render() {
    const { viewer } = this.props;

    return (
      <ul>
        {getNodesFromConnection(viewer.projects).map(project =>
          <li key={project.id}>
            <input name={project.id} type="checkbox" checked readOnly />
            <label htmlFor={project.id}>
              {project.title}
            </label>
          </li>,
        )}
        <button onClick={this._handleUpdateButtonClick}>Update</button>
      </ul>
    );
  }
}

export default createRefetchContainer(
  DailyReportPage,
  graphql.experimental`
    fragment DailyReportPage_viewer on User
      @argumentDefinitions(
        count: { type: "Int", defaultValue: 100 }
        date: { type: "Date" }
      ) {
      id
      projects(first: $count) @connection(key: "DailyReportPage_projects") {
        edges {
          node {
            id
            title
          }
        }
      }
      todoTaskSets: taskSets(first: $count)
        @connection(key: "DailyReportPage_todoTaskSets") {
        edges {
          node {
            id
            title
          }
        }
      }
      dailySchedule(date: $date) {
        timeUnits(first: $count) @connection(key: "DailyReportPage_timeUnits") {
          edges {
            node {
              doneTaskUnits: taskUnits(first: $count)
                @connection(key: "DailyReportPage_doneTaskUnits") {
                edges {
                  node {
                    id
                    taskSet {
                      id
                      title
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `,
  graphql.experimental`
    query DailyReportPageRefetchQuery($count: Int) {
      viewer {
        ...DailyReportPage_viewer @arguments(count: $count)
      }
    }
  `,
);
