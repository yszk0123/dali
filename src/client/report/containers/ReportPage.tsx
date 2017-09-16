import * as React from 'react';
import { graphql, compose, QueryProps, ChildProps } from 'react-apollo';
import { RouteComponentProps } from 'react-router-dom';
import { subDays, addDays } from 'date-fns';
import { flatten, groupBy, toPairs, repeat } from 'lodash';
import { ReportPageQuery } from 'schema';
import * as REPORT_PAGE_QUERY from '../querySchema/ReportPage.graphql';
import ClipboardButton from '../../shared/components/ClipboardButton';
import Button from '../../shared/components/Button';
import DateSwitch from '../../shared/components/DateSwitch';
import styled from '../../shared/styles/StyledComponents';
import toDaliDate from '../../shared/utils/toDaliDate';
import getToday from '../../shared/utils/getToday';
import { DateOnly } from '../../app/interfaces';

const DEFAULT_PROJECT_NAME = 'Default';

const TextArea = styled.textarea`
  display: block;
  min-width: 24rem;
  min-height: 30rem;
`;

type OwnProps = RouteComponentProps<any>;

type Props = QueryProps &
  ReportPageQuery &
  OwnProps & {
    date: DateOnly;
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
  const prev = toDaliDate(subDays(date, 1));
  const next = toDaliDate(addDays(date, 1));

  return (
    <div>
      <DateSwitch
        date={date}
        previousLink={`/report/${prev}`}
        nextLink={`/report/${next}`}
      />
      <ClipboardButton target="#reportAsMarkdown" />
      <Button onClick={refetch}>Update</Button>
      <ul>
        {result.map((task: any) => (
          <li key={task.id}>
            <h3>{task.project}</h3>
            <ul>
              {task.tasks.map((task: any) => (
                <li key={task.id}>
                  <h4>{task.phase}</h4>
                  <ul>
                    {task.tasks.map((task: any) => (
                      <li key={task.id}>{task.title}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </li>
        ))}
        <hr />
        <TextArea id="reportAsMarkdown" readOnly value={markdown} />
      </ul>
    </div>
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
  graphql<Response & ReportPageQuery, OwnProps, Props>(REPORT_PAGE_QUERY, {
    options: ({ match }) => ({
      variables: { date: match.params.date || getToday() },
      fetchPolicy: 'network-only',
    }),
    props: ({ data, ownProps: { match } }) => {
      const result = data && groupTasks(data.timeUnits);
      return {
        ...data,
        date: match.params.date || getToday(),
        result,
        markdown: renderAsMarkdown(result),
        loading: data && (data.loading || !data.timeUnits),
      };
    },
  }),
);

export default withData(ReportPage);
