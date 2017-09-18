import * as React from 'react';
import { graphql, compose, QueryProps, ChildProps } from 'react-apollo';
import { RouteComponentProps } from 'react-router-dom';
import { ActionPageQuery } from 'schema';
import * as action_PAGE_QUERY from '../querySchema/ActionPage.graphql';
import { UpdateAction } from '../mutations';
import { styled } from '../../shared/styles';
import {
  Icon,
  List,
  ListItem,
  TitleInput,
  TitleSelect,
} from '../../shared/components';

const Wrapper = styled.div`font-size: 1.6rem;`;

type Data = Response & ActionPageQuery;

type OwnProps = RouteComponentProps<any> & {
  queryVariables: {};
};

type Props = QueryProps &
  OwnProps &
  ActionPageQuery & {
    isLogin: boolean;
    updateTitle(title: string): void;
    setTask(taskId: string): void;
  };

interface State {
  title: string;
}

export class ActionPage extends React.Component<
  ChildProps<Props, Response>,
  State
> {
  render() {
    const { isLogin, action, tasks, updateTitle, setTask } = this.props;

    if (!isLogin || !action || !tasks) {
      return <span>Loading...</span>;
    }

    const mappedTasks = (tasks || []).map(
      task =>
        task && {
          id: task.id,
          title: `${(task.project && task.project.title) ||
            ''} > ${task.title}`,
        },
    );

    const taskTitle = (action.task && action.task.title) || '';

    return (
      <Wrapper>
        <List>
          <ListItem leftIcon={<Icon icon="actions" />}>
            <TitleSelect
              defaultLabel="Task"
              fullWidth
              selectedId={(action.task && action.task.id) || null}
              onChange={setTask}
              items={mappedTasks}
            />
          </ListItem>
          <ListItem leftIcon={<Icon icon="list" />}>
            <TitleInput fullWidth title={action.title} onChange={updateTitle} />
          </ListItem>
        </List>
      </Wrapper>
    );
  }
}

const withData = compose(
  graphql<Data, OwnProps, Props>(action_PAGE_QUERY, {
    options: ({ match }) => ({
      variables: {
        actionId: match.params.actionId,
      },
      fetchPolicy: 'network-only',
    }),
    props: ({ data, ownProps: { match } }) => ({
      data,
      ...data,
      isLogin: data && data.currentUser,
      queryVariables: {
        actionId: match.params.actionId,
      },
    }),
  }),
  graphql<Data, Props, Props>(UpdateAction.mutation, {
    props: ({ mutate, ownProps: { action, queryVariables } }) => ({
      updateTitle: (title: string) =>
        action &&
        mutate &&
        mutate(
          UpdateAction.build({ actionId: action.id, title }, queryVariables, action),
        ),
      setTask: (taskId: string) =>
        action &&
        mutate &&
        mutate(
          UpdateAction.build({ actionId: action.id, taskId }, queryVariables, action),
        ),
    }),
  }),
);

export default withData(ActionPage);
