import * as React from 'react';
import styled from 'styled-components';
import { createRefetchContainer, graphql } from 'react-relay';
import getNodesFromConnection from '../../shared/utils/getNodesFromConnection';
import ClipboardButton from '../components/ClipboardButton';
import Button from '../components/Button';
import Day from '../components/Day';

const DEFAULT_PROJECT_NAME = 'Default';
const MAX_LEVEL = 5;

const TextArea = styled.textarea`
  display: block;
  min-width: 10rem;
  min-height: 4rem;
`;

export class DailyReportPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      level: 1,
    };
  }

  _handleUpdateButtonClick = () => {
    this._update();
  };

  _handleLevelChange = (event: Event) => {
    const level = parseInt(event.target.value, 10);

    this.setState({
      level,
    });
  };

  _update() {
    const { viewer } = this.props;
    const refetchVariables = ({ count }) => ({
      count,
      date: viewer.dailySchedule.date,
    });

    this.props.relay.refetch(refetchVariables, null);
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
    const { level } = this.state;

    return tasksByProject
      .map(({ project, tasks }) => {
        const tasksAsString = tasks.map(task => `- ${task.title}`).join('\n');
        return `${repeat('#', level)} ${project}\n\n${tasksAsString}`;
      })
      .join('\n\n');
  }

  render() {
    const { viewer, defaultDate } = this.props;
    const { level } = this.state;
    let date = defaultDate;
    let report = null;

    if (viewer.dailySchedule) {
      const tasksByProject = this._calculateTasksByProject();
      date = viewer.dailySchedule.date;

      report = (
        <ul>
          {this._renderAsList(tasksByProject)}
          <br />
          <TextArea
            id="dailyReportAsMarkdown"
            readOnly
            value={this._renderAsMarkdown(tasksByProject)}
          />
          <ClipboardButton target="#dailyReportAsMarkdown" />
          <Button onClick={this._handleUpdateButtonClick}>Update</Button>
          <div>
            <label htmlFor="dailyReportLevel">Level: </label>
            <input
              id="dailyReportLevel"
              type="number"
              min="1"
              max={MAX_LEVEL}
              value={level}
              onChange={this._handleLevelChange}
            />
          </div>
        </ul>
      );
    }

    return (
      <div>
        <h2>
          <Day date={date} />
        </h2>
        {report}
      </div>
    );
  }
}
