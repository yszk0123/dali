import * as React from 'react';
import { graphql, compose, QueryProps, ChildProps } from 'react-apollo';
import { RouteComponentProps } from 'react-router-dom';
import { subDays, addDays } from 'date-fns';
import { flatten, groupBy, toPairs, repeat } from 'lodash';
import { ReportPageQuery } from 'schema';
import * as REPORT_PAGE_QUERY from '../querySchema/ReportPage.graphql';
import { Button, ClipboardButton, DateSwitch } from '../../shared/components';
import { styled } from '../../shared/styles';
import { getToday, toDaliDate } from '../../shared/utils';
import { DateOnly } from '../../shared/interfaces';

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
        {result.map((action: any) => (
          <li key={action.id}>
            <h3>{action.project}</h3>
            <ul>
              {action.actions.map((action: any) => (
                <li key={action.id}>
                  <h4>{action.task}</h4>
                  <ul>
                    {action.actions.map((action: any) => (
                      <li key={action.id}>{action.title}</li>
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
function groupActions(periods: ReportPageQuery['periods']) {
  if (!periods) {
    return [];
  }

  return toPairs(
    groupBy(
      filterNonNull(
        flatten(filterNonNull(periods).map(t => !!t && t.actions)),
      ).map(({ id, done, title, task }) => {
        const project = task && task.project;
        return {
          id,
          title,
          done,
          taskId: (task && task.id) || '',
          taskTitle: (task && task.title) || '',
          projectId: (project && project.id) || '',
          projectTitle: (project && project.title) || DEFAULT_PROJECT_NAME,
        };
      }),
      action => action.projectId,
    ),
  ).map(([projectId, actions]) => ({
    id: projectId,
    project: actions[0].projectTitle,
    actions: toPairs(
      groupBy(actions, (action: any) => action.taskId),
    ).map(([taskId, actions]) => ({
      id: taskId,
      task: actions[0].taskTitle,
      actions: actions,
    })),
  }));
}

function renderAsMarkdown(result: any): string {
  return result
    .map((action: any) => {
      const actionsAsString = action.actions
        .map((action: any) => {
          const str = action.actions
            .map(
              (action: any) => `    - [${action.done ? 'x' : ' '}] ${action.title}`,
            )
            .join('\n');
          return `- ${action.task}\n${str}`;
        })
        .join('\n');

      return `## ${action.project}\n\n${actionsAsString}`;
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
      const result = data && groupActions(data.periods);
      return {
        ...data,
        date: match.params.date || getToday(),
        result,
        markdown: renderAsMarkdown(result),
        loading: data && (data.loading || !data.periods),
      };
    },
  }),
);

export default withData(ReportPage);
