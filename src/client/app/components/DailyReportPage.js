import React from 'react';
import { createRefetchContainer, graphql } from 'react-relay';
import { flatten, uniqBy, groupBy, toPairs } from 'lodash';
import getNodesFromConnection from '../../shared/utils/getNodesFromConnection';
import ClipboardButton from './ClipboardButton';

const DEFAULT_PROJECT_NAME = 'Default';

export class DailyReportPage extends React.Component {
  _handleUpdateButtonClick = () => {
    this._update();
  };

  _update() {
    const refetchVariables = ({ count }) => ({ count });

    this.props.relay.refetch(refetchVariables, null);
  }

  // TODO: Move this logic to server side
  _calculateTasksByProject() {
    const { viewer } = this.props;

    return toPairs(
      groupBy(
        flatten(
          getNodesFromConnection(viewer.dailySchedule.timeUnits).map(timeUnit =>
            getNodesFromConnection(timeUnit.doneTaskUnits).map(taskUnit => ({
              id: taskUnit.id,
              title: taskUnit.taskSet.title,
              taskSetId: taskUnit.taskSet.id,
              project:
                (taskUnit.taskSet.project && taskUnit.taskSet.project.title) ||
                DEFAULT_PROJECT_NAME,
            })),
          ),
        ),
        task => task.project,
      ),
    ).map(([project, tasks]) => ({
      project,
      tasks: uniqBy(tasks, 'taskSetId'),
    }));
  }

  _renderAsList(tasksByProject) {
    return tasksByProject.map(({ project, tasks }) =>
      <li key={project}>
        <h3>
          {project}
        </h3>
        <ul>
          {tasks.map(task =>
            <li key={task.id}>
              {task.title}
            </li>,
          )}
        </ul>
      </li>,
    );
  }

  _renderAsMarkdown(tasksByProject) {
    return tasksByProject
      .map(({ project, tasks }) => {
        const tasksAsString = tasks.map(task => `- ${task.title}`).join('\n');
        return `# ${project}\n\n${tasksAsString}`;
      })
      .join('\n\n');
  }

  render() {
    const tasksByProject = this._calculateTasksByProject();

    return (
      <ul>
        {this._renderAsList(tasksByProject)}
        <textarea
          id="dailyReportAsMarkdown"
          readOnly
          value={this._renderAsMarkdown(tasksByProject)}
        />
        <ClipboardButton target="#dailyReportAsMarkdown" />
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
              id
              doneTaskUnits: taskUnits(first: $count)
                @connection(key: "DailyReportPage_doneTaskUnits") {
                edges {
                  node {
                    id
                    taskSet {
                      id
                      title
                      project {
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
