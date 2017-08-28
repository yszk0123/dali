import * as React from 'react';
import { graphql, compose, ChildProps } from 'react-apollo';
import {
  TimeUnitItem_timeUnitFragment,
  AddTaskToTimeUnitForm_phasesFragment,
  AddTaskToTimeUnitForm_tasksFragment,
} from 'schema';
import styled from '../styles/StyledComponents';
import TitleSelect from '../components/TitleSelect';
import TitleInput from '../components/TitleInput';
import * as CreateTimeUnitTaskMutation from '../../graphql/mutations/CreateTimeUnitTaskMutation';
import * as AddTaskToTimeUnitMutation from '../../graphql/mutations/AddTaskToTimeUnitMutation';

const List = styled.div`
  minWidth: 300px;
  display: flex;
  flex-direction: column;
`;

const ListItem = styled.div`
  margin-bottom: 1rem;
  align-content: center;
`;

const ErrorMessage = styled.span`
  padding: 0.8rem;
  font-size: 80%;
  color: red;
`;

interface OwnProps {
  timeUnit: TimeUnitItem_timeUnitFragment;
  phases: (AddTaskToTimeUnitForm_phasesFragment | null)[];
  tasks: (AddTaskToTimeUnitForm_tasksFragment | null)[];
}

type Props = OwnProps & {
  createTask(phaseId: string | null, title: string): void;
  addTask(task: AddTaskToTimeUnitForm_tasksFragment): void;
};

interface State {
  selectedPhaseId: string | null;
  error: string | null;
}

export class CreateTimeUnitTaskForm extends React.Component<
  ChildProps<Props, Response>,
  State
> {
  state = {
    selectedPhaseId: null,
    error: null,
  };

  private handlePhaseSelect = (selectedPhaseId: string) => {
    this.setState({ selectedPhaseId });
  };

  private handleCreate = (title: string) => {
    const { selectedPhaseId } = this.state;

    this.props.createTask(selectedPhaseId, title);
    this.reset();
  };

  private handleAdd = (taskId: string) => {
    const { addTask, tasks } = this.props;
    const task = tasks.find(task => !!task && task.id === taskId);
    if (!task) {
      this.setState({ error: 'task not found' });
      return;
    }
    addTask(task);
    this.reset();
  };

  private reset() {
    this.setState({
      error: null,
    });
  }

  render() {
    const { createTask, phases, tasks } = this.props;
    const { selectedPhaseId, error } = this.state;

    return (
      <div>
        <TitleSelect
          defaultLabel="Phase"
          selectedId={selectedPhaseId}
          onChange={this.handlePhaseSelect}
          items={phases}
        />
        <TitleSelect
          defaultLabel="Task"
          selectedId=""
          onCreate={this.handleCreate}
          onChange={this.handleAdd}
          items={tasks}
          resetAfterSelect
        />
        {error &&
          <ErrorMessage>
            {error}
          </ErrorMessage>}
      </div>
    );
  }
}

const withData = compose(
  graphql<Response, OwnProps, Props>(AddTaskToTimeUnitMutation.mutation, {
    props: ({ mutate, ownProps: { timeUnit } }) => ({
      addTask: (task: AddTaskToTimeUnitForm_tasksFragment) =>
        mutate &&
        mutate(
          AddTaskToTimeUnitMutation.buildMutationOptions(
            { timeUnitId: timeUnit.id, taskId: task.id },
            {},
            timeUnit,
          ),
        ),
    }),
  }),
  graphql<Response, OwnProps, Props>(CreateTimeUnitTaskMutation.mutation, {
    props: ({ mutate, ownProps: { timeUnit } }) => ({
      createTask: (phaseId: string | null, title: string) =>
        phaseId &&
        mutate &&
        mutate(
          CreateTimeUnitTaskMutation.buildMutationOptions(
            { title, phaseId, timeUnitId: timeUnit.id },
            {},
            timeUnit,
          ),
        ),
    }),
  }),
);

export default withData(CreateTimeUnitTaskForm);