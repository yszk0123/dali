import * as React from 'react';
import { graphql, compose, ChildProps } from 'react-apollo';
import {
  AddTaskToTimeUnitFormQuery,
  AddTaskToTimeUnitForm_tasksFragment,
  TimeUnitItem_timeUnitFragment,
} from 'schema';
import styled from '../styles/StyledComponents';
import TitleSelect from '../components/TitleSelect';
import TitleInput from '../components/TitleInput';
import * as addTaskToTimeUnitFormQuery from '../../graphql/querySchema/AddTaskToTimeUnitForm.graphql';
import * as CreateTimeUnitTaskMutation from '../../graphql/mutations/CreateTimeUnitTaskMutation';
import * as AddTaskToTimeUnitMutation from '../../graphql/mutations/AddTaskToTimeUnitMutation';

const Wrapper = styled.div`font-size: 1.6rem;`;

const ErrorMessage = styled.span`
  padding: 0.8rem;
  font-size: 1.4rem;
  color: red;
`;

type Data = Response & AddTaskToTimeUnitFormQuery;

interface OwnProps {
  timeUnit: TimeUnitItem_timeUnitFragment;
  onClose?(): void;
}

type Props = AddTaskToTimeUnitFormQuery &
  OwnProps & {
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
    this.close();
  };

  private handleAdd = (taskId: string) => {
    const { addTask, tasks } = this.props;
    const task = tasks && tasks.find(task => !!task && task.id === taskId);
    if (!task) {
      this.setState({ error: 'task not found' });
      return;
    }
    addTask(task);
    this.close();
  };

  private handleBlur = () => {
    this.close();
  };

  private close() {
    const { onClose } = this.props;

    this.setState({
      error: null,
    });

    onClose && onClose();
  }

  render() {
    const { createTask, phases, tasks } = this.props;
    const { selectedPhaseId, error } = this.state;

    const mappedPhases = (phases || []).map(
      item =>
        item && {
          id: item.id,
          title: `${(item.project && item.project.title) ||
            ''} > ${item.title}`,
        },
    );
    const mappedTasks = (tasks || []).map(
      item =>
        item && {
          id: item.id,
          title: `${(item.phase && item.phase.title) || ''} > ${item.title}`,
        },
    );

    return (
      <Wrapper>
        <TitleSelect
          defaultLabel="Phase"
          selectedId={selectedPhaseId}
          onChange={this.handlePhaseSelect}
          items={mappedPhases}
        />
        <TitleSelect
          defaultLabel="Task"
          selectedId=""
          onCreate={this.handleCreate}
          onChange={this.handleAdd}
          onBlur={this.handleBlur}
          items={mappedTasks}
          resetAfterSelect
        />
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </Wrapper>
    );
  }
}

const withData = compose(
  graphql<Data, OwnProps, Props>(addTaskToTimeUnitFormQuery, {
    options: {
      fetchPolicy: 'network-only',
    },
    props: ({ data }) => ({
      ...data,
    }),
  }),
  graphql<Data, OwnProps, Props>(AddTaskToTimeUnitMutation.mutation, {
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
  graphql<Data, OwnProps, Props>(CreateTimeUnitTaskMutation.mutation, {
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
