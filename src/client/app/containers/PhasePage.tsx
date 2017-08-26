import * as React from 'react';
import { graphql, compose, QueryProps, ChildProps } from 'react-apollo';
import {
  PhasePageQuery,
  PhaseItem_phaseFragment,
  TaskItem_taskFragment,
} from 'schema';
import * as phasePageQuery from '../../graphql/querySchema/PhasePage.graphql';
import * as CreatePhaseMutation from '../../graphql/mutations/CreatePhaseMutation';
import styled from '../styles/StyledComponents';
import Button from '../components/Button';
import Dummy from '../Dummy';
import PhaseItem from './PhaseItem';

const PhaseItemWrapper = styled.div`
  margin: 1.6rem 0;
  border-top: 1px solid #ccc;
`;

interface PhasePageProps {
  isLogin: boolean;
  createPhase(title: string): void;
}

type Props = QueryProps & PhasePageQuery & PhasePageProps;

interface State {
  title: string;
  phaseDone: boolean;
  taskDone: boolean;
}

export class PhasePage extends React.Component<
  ChildProps<Props, Response>,
  State
> {
  state = { title: '', phaseDone: false, taskDone: false };

  private handleCreatePhaseClick = (event: React.MouseEvent<HTMLElement>) => {
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

  private handlePhaseDoneChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { refetch } = this.props;
    const phaseDone = !!event.target.checked;

    this.setState<'phaseDone'>({ phaseDone }, () => {
      refetch({ phaseDone });
    });
  };

  private handleTaskDoneChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { refetch } = this.props;
    const taskDone = !!event.target.checked;

    this.setState<'taskDone'>({ taskDone }, () => {
      refetch({ taskDone });
    });
  };

  render() {
    const { isLogin, phases, projects } = this.props;
    const { title, phaseDone, taskDone } = this.state;

    if (!isLogin) {
      return <span>Loading...</span>;
    }

    return (
      <div>
        <label htmlFor="phaseDone">PhaseDone: </label>
        <input
          id="phaseDone"
          type="checkbox"
          checked={phaseDone}
          onChange={this.handlePhaseDoneChange}
        />
        <label htmlFor="taskDone">TaskDone: </label>
        <input
          id="taskDone"
          type="checkbox"
          checked={taskDone}
          onChange={this.handleTaskDoneChange}
        />
        {phases &&
          phases.map(
            phase =>
              phase &&
              <PhaseItemWrapper key={phase.id}>
                <PhaseItem phase={phase} projects={projects} />
              </PhaseItemWrapper>,
          )}
        <input type="text" value={title} onChange={this.handleTitleChange} />
        <Button onClick={this.handleCreatePhaseClick}>Add</Button>
      </div>
    );
  }
}

const withData = compose(
  graphql<Response & PhasePageQuery, {}, Props>(phasePageQuery, {
    options: {
      variables: { phaseDone: false, taskDone: false },
    },
    props: ({ data }) => ({
      ...data,
      isLogin: data && data.currentUser,
    }),
  }),
  graphql<Response & PhasePageProps, {}, Props>(CreatePhaseMutation.mutation, {
    props: ({ mutate }) => ({
      createPhase: (title: string) =>
        mutate &&
        mutate(
          CreatePhaseMutation.buildMutationOptions(
            { title },
            { phaseDone: false, taskDone: false },
          ),
        ),
    }),
  }),
);

export default withData(PhasePage);
