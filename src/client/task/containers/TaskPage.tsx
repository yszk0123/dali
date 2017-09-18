import * as React from 'react';
import { graphql, compose, QueryProps, ChildProps } from 'react-apollo';
import { RouteComponentProps } from 'react-router-dom';
import {
  TaskPageQuery,
  TaskPageQueryVariables,
  TaskItem_taskFragment,
  TaskActionItem_actionFragment,
} from 'schema';
import * as task_PAGE_QUERY from '../querySchema/TaskPage.graphql';
import { CreateTask } from '../mutations';
import { styled } from '../../shared/styles';
import { TitleInput } from '../../shared/components';
import TaskItem from './TaskItem';

const Wrapper = styled.div`font-size: 1.6rem;`;

const TaskItemWrapper = styled.div`margin: 1.6rem 0;`;

const TitleInputWrapper = styled.div`margin: 1.6rem 0.8rem;`;

type Data = Response & TaskPageQuery;

type OwnProps = RouteComponentProps<any> & {
  queryVariables: TaskPageQueryVariables;
};

type Props = QueryProps &
  TaskPageQuery &
  OwnProps & {
    isLogin: boolean;
    createTask(title: string): void;
  };

interface State {
  taskDone: boolean;
  actionUsed: boolean;
}

export class TaskPage extends React.Component<
  ChildProps<Props, Response>,
  State
> {
  state = { taskDone: false, actionUsed: false };

  private handleTaskDoneChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { refetch } = this.props;
    const taskDone = !!event.target.checked;

    this.setState<'taskDone'>({ taskDone }, () => {
      refetch({ taskDone });
    });
  };

  private handleActionDoneChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { refetch } = this.props;
    const actionUsed = !!event.target.checked;

    this.setState<'actionUsed'>({ actionUsed }, () => {
      refetch({ actionUsed });
    });
  };

  render() {
    const { isLogin, tasks, projects, createTask, queryVariables } = this.props;
    const { taskDone, actionUsed } = this.state;

    if (!isLogin) {
      return <span>Loading...</span>;
    }

    return (
      <Wrapper>
        <label htmlFor="taskDone">TaskDone: </label>
        <input
          id="taskDone"
          type="checkbox"
          checked={taskDone}
          onChange={this.handleTaskDoneChange}
        />
        <label htmlFor="actionUsed">ActionUsed: </label>
        <input
          id="actionUsed"
          type="checkbox"
          checked={actionUsed}
          onChange={this.handleActionDoneChange}
        />
        {tasks &&
          tasks.map(
            task =>
              task && (
                <TaskItemWrapper key={task.id}>
                  <TaskItem
                    task={task}
                    projects={projects}
                    queryVariables={queryVariables}
                  />
                </TaskItemWrapper>
              ),
          )}
        <TitleInputWrapper>
          <TitleInput
            defaultLabel="New Task"
            title=""
            fullWidth
            onChange={createTask}
          />
        </TitleInputWrapper>
      </Wrapper>
    );
  }
}

const withData = compose(
  graphql<Data, OwnProps, Props>(task_PAGE_QUERY, {
    options: ({ match }) => ({
      variables: {
        taskDone: false,
        actionUsed: false,
        groupId: match.params.groupId,
        projectId: match.params.projectId,
      },
      fetchPolicy: 'network-only',
    }),
    props: ({ data, ownProps: { match } }) => ({
      ...data,
      queryVariables: {
        taskDone: false,
        actionUsed: false,
        groupId: match.params.groupId,
        projectId: match.params.projectId,
      },
      isLogin: data && data.currentUser,
    }),
  }),
  graphql<Data, OwnProps, Props>(CreateTask.mutation, {
    props: ({ mutate, ownProps: { queryVariables } }) => ({
      createTask: (title: string) =>
        mutate && mutate(CreateTask.build({ title }, queryVariables)),
    }),
  }),
);

export default withData(TaskPage);
