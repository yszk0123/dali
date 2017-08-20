import * as React from 'react';
import { graphql, compose, QueryProps, ChildProps } from 'react-apollo';
import {
  TasksPageQuery,
  PhaseItem_phaseFragment,
  TaskItem_taskFragment,
} from 'schema';
import * as tasksPageQuery from '../../graphql/querySchema/TasksPage.graphql';
import * as CreatePhaseMutation from '../../graphql/mutations/CreatePhaseMutation';
import Button from '../components/Button';
import PhaseItem from './PhaseItem';
import Dummy from '../Dummy';

interface TasksPageProps {
  isLogin: boolean;
  createPhase(title: string): void;
}

type Props = QueryProps & TasksPageQuery & TasksPageProps;

interface State {
  title: string;
  done: boolean;
}

export class TasksPage extends React.Component<
  ChildProps<Props, Response>,
  State
> {
  state = { title: '', done: false };

  private handleAddTaskClick = (event: React.MouseEvent<HTMLElement>) => {
    const { title } = this.state;

    if (title) {
      this.props.createPhase(title);
      this.setState({
        title: '',
      });
    }
  };

  private handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      title: event.target.value,
    });
  };

  private handleDoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { refetch } = this.props;
    const done = !!event.target.checked;

    this.setState({ done }, () => {
      refetch({ done });
    });
  };

  render() {
    const { isLogin, phases } = this.props;
    const { title, done } = this.state;

    if (!isLogin) {
      return <span>Loading...</span>;
    }

    return (
      <div>
        <h1>Phases</h1>
        <label htmlFor="phaseDone">Done: </label>
        <input
          type="checkbox"
          checked={done}
          onChange={this.handleDoneChange}
        />
        <div>
          {phases.map(phase =>
            <PhaseItem key={phase.id} phase={phase} />,
          )}
        </div>
        <input type="text" value={title} onChange={this.handleTitleChange} />
        <Button onClick={this.handleAddTaskClick}>Add</Button>
      </div>
    );
  }
}

const withData = compose(
  graphql<Response & TasksPageQuery, {}, Props>(tasksPageQuery, {
    options: {
      variables: { done: false },
    },
    props: ({ data }) => ({
      ...data,
      isLogin: data && data.currentUser,
    }),
  }),
  graphql<
    Response & TasksPageProps,
    {},
    Props
  >(CreatePhaseMutation.mutation, {
    props: ({ mutate }) => ({
      createPhase: (title: string) =>
        mutate(
          CreatePhaseMutation.buildMutationOptions(
            { title },
            { done: false },
          ),
        ),
    }),
  }),
);

export default withData(TasksPage);
