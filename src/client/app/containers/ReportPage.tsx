import * as React from 'react';
import { graphql, compose, QueryProps, ChildProps } from 'react-apollo';
import { flatten, groupBy, toPairs, repeat } from 'lodash';
import { ReportPageQuery } from 'schema';
import * as reportPageQuery from '../../graphql/querySchema/ReportPage.graphql';
import ClipboardButton from '../components/ClipboardButton';
import styled from '../styles/StyledComponents';
import NoUserSelectArea from '../components/NoUserSelectArea';
import { DateOnly } from '../interfaces';

const DEFAULT_PROJECT_NAME = 'Default';

const TextArea = styled.textarea`
  display: block;
  min-width: 24rem;
  min-height: 30rem;
`;

interface OwnProps {
  date: DateOnly;
}

type Props = QueryProps &
  ReportPageQuery &
  OwnProps & {
    result: any;
    markdown: string;
  };

export function ReportPage({
  date,
  loading,
  refetch,
  result,
  markdown,
}: Props) {
  if (loading || !result) {
    return null;
  }

  return (
    <ul>
      {result.map((task: any) =>
        <li key={task.id}>
          <h3>
            {task.project}
          </h3>
          <ul>
            {task.tasks.map((task: any) =>
              <li key={task.id}>
                <h4>
                  {task.phase}
                </h4>
                <ul>
                  {task.tasks.map((task: any) =>
                    <li key={task.id}>
                      {task.title}
                    </li>,
                  )}
                </ul>
              </li>,
            )}
          </ul>
        </li>,
      )}
      <hr />
      <TextArea id="reportAsMarkdown" readOnly value={markdown} />
      <ClipboardButton target="#reportAsMarkdown" />
      <button onClick={refetch}>Update</button>
    </ul>
  );
}

function filterNonNull<T>(items: (T | null)[]): T[] {
  return (items as any).filter((item: any) => !!item);
}

// TODO: Move this logic to server side
function groupTasks(timeUnits: ReportPageQuery['timeUnits']) {
  if (!timeUnits) {
    return [];
  }

  return toPairs(
    groupBy(
      filterNonNull(
        flatten(filterNonNull(timeUnits).map(t => !!t && t.tasks)),
      ).map(({ id, done, title, phase }) => {
        const project = phase && phase.project;
        return {
          id,
          title,
          done,
          phaseId: (phase && phase.id) || '',
          phaseTitle: (phase && phase.title) || '',
          projectId: (project && project.id) || '',
          projectTitle: (project && project.title) || DEFAULT_PROJECT_NAME,
        };
      }),
      task => task.projectId,
    ),
  ).map(([projectId, tasks]) => ({
    id: projectId,
    project: tasks[0].projectTitle,
    tasks: toPairs(
      groupBy(tasks, (task: any) => task.phaseId),
    ).map(([phaseId, tasks]) => ({
      id: phaseId,
      phase: tasks[0].phaseTitle,
      tasks: tasks,
    })),
  }));
}

function renderAsMarkdown(result: any): string {
  return result
    .map((task: any) => {
      const tasksAsString = task.tasks
        .map((task: any) => {
          const str = task.tasks
            .map(
              (task: any) => `    - [${task.done ? 'x' : ' '}] ${task.title}`,
            )
            .join('\n');
          return `- ${task.phase}\n${str}`;
        })
        .join('\n');

      return `## ${task.project}\n\n${tasksAsString}`;
    })
    .join('\n\n');
}

const withData = compose(
  graphql<Response & ReportPageQuery, OwnProps, Props>(reportPageQuery, {
    options: ({ date }) => ({
      variables: { date },
    }),
    props: ({ data }) => {
      const result = data && groupTasks(data.timeUnits);
      return {
        ...data,
        result,
        markdown: renderAsMarkdown(result),
        loading: data && (data.loading || !data.timeUnits),
      };
    },
  }),
);

export default withData(ReportPage);
