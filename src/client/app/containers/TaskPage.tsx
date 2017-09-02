import * as React from 'react';
import { graphql, compose, QueryProps, ChildProps } from 'react-apollo';
import { RouteComponentProps } from 'react-router-dom';
import { TaskPageQuery } from 'schema';
import * as TASK_PAGE_QUERY from '../../graphql/querySchema/TaskPage.graphql';
import * as UpdateTaskMutation from '../../graphql/mutations/UpdateTaskMutation';
import styled from '../styles/StyledComponents';
import TitleInput from '../components/TitleInput';

type Data = Response & TaskPageQuery;

type OwnProps = RouteComponentProps<any> & {
  queryVariables: {};
};

type Props = QueryProps &
  OwnProps &
  TaskPageQuery & {
    isLogin: boolean;
    updateTitle(title: string): void;
  };

interface State {
  title: string;
}

export class TaskPage extends React.Component<
  ChildProps<Props, Response>,
  State
> {
  render() {
    const { isLogin, task, updateTitle } = this.props;

    if (!isLogin || !task) {
      return <span>Loading...</span>;
    }

    return (
      <div>
        <TitleInput fullWidth title={task.title} onChange={updateTitle} />
      </div>
    );
  }
}

const withData = compose(
  graphql<Data, OwnProps, Props>(TASK_PAGE_QUERY, {
    options: ({ match }) => ({
      variables: {
        taskId: match.params.taskId,
      },
      fetchPolicy: 'network-only',
    }),
    props: ({ data, ownProps: { match } }) => ({
      data,
      ...data,
      isLogin: data && data.currentUser,
      queryVariables: {
        taskId: match.params.taskId,
      },
    }),
  }),
  graphql<Data, Props, Props>(UpdateTaskMutation.mutation, {
    props: ({ mutate, ownProps: { task, queryVariables } }) => ({
      updateTitle: (title: string) =>
        task &&
        mutate &&
        mutate(
          UpdateTaskMutation.buildMutationOptions(
            { taskId: task.id, title },
            queryVariables,
            task,
          ),
        ),
    }),
  }),
);

export default withData(TaskPage);
