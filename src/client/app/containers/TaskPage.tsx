import * as React from 'react';
import { graphql, compose, QueryProps, ChildProps } from 'react-apollo';
import { RouteComponentProps } from 'react-router-dom';
import { TaskPageQuery } from 'schema';
import * as TASK_PAGE_QUERY from '../../graphql/querySchema/TaskPage.graphql';
import * as UpdateTaskMutation from '../../graphql/mutations/UpdateTaskMutation';
import styled from '../styles/StyledComponents';
import TitleInput from '../components/TitleInput';
import TitleSelect from '../components/TitleSelect';
import Icon from '../components/Icon';
import List from '../components/List';
import ListItem from '../components/ListItem';

const Wrapper = styled.div`font-size: 1.6rem;`;

type Data = Response & TaskPageQuery;

type OwnProps = RouteComponentProps<any> & {
  queryVariables: {};
};

type Props = QueryProps &
  OwnProps &
  TaskPageQuery & {
    isLogin: boolean;
    updateTitle(title: string): void;
    setPhase(phaseId: string): void;
  };

interface State {
  title: string;
}

export class TaskPage extends React.Component<
  ChildProps<Props, Response>,
  State
> {
  render() {
    const { isLogin, task, phases, updateTitle, setPhase } = this.props;

    if (!isLogin || !task || !phases) {
      return <span>Loading...</span>;
    }

    const mappedPhases = (phases || []).map(
      phase =>
        phase && {
          id: phase.id,
          title: `${(phase.project && phase.project.title) ||
            ''} > ${phase.title}`,
        },
    );

    const phaseTitle = (task.phase && task.phase.title) || '';

    return (
      <Wrapper>
        <List>
          <ListItem leftIcon={<Icon icon="tasks" />}>
            <TitleSelect
              defaultLabel="Phase"
              fullWidth
              selectedId={(task.phase && task.phase.id) || null}
              onChange={setPhase}
              items={mappedPhases}
            />
          </ListItem>
          <ListItem leftIcon={<Icon icon="list" />}>
            <TitleInput fullWidth title={task.title} onChange={updateTitle} />
          </ListItem>
        </List>
      </Wrapper>
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
      setPhase: (phaseId: string) =>
        task &&
        mutate &&
        mutate(
          UpdateTaskMutation.buildMutationOptions(
            { taskId: task.id, phaseId },
            queryVariables,
            task,
          ),
        ),
    }),
  }),
);

export default withData(TaskPage);
