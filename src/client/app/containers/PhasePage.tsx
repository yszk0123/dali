import * as React from 'react';
import { graphql, compose, QueryProps, ChildProps } from 'react-apollo';
import { RouteComponentProps } from 'react-router-dom';
import {
  PhasePageQuery,
  PhasePageQueryVariables,
  PhaseItem_phaseFragment,
  PhaseTaskItem_taskFragment,
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

type Data = Response & PhasePageQuery;

type OwnProps = RouteComponentProps<any> & {
  queryVariables: PhasePageQueryVariables;
};

type Props = QueryProps &
  PhasePageQuery &
  OwnProps & {
    isLogin: boolean;
    createPhase(title: string): void;
  };

interface State {
  title: string;
  phaseDone: boolean;
  taskUsed: boolean;
}

export class PhasePage extends React.Component<
  ChildProps<Props, Response>,
  State
> {
  state = { title: '', phaseDone: false, taskUsed: false };

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
    const taskUsed = !!event.target.checked;

    this.setState<'taskUsed'>({ taskUsed }, () => {
      refetch({ taskUsed });
    });
  };

  render() {
    const { isLogin, phases, projects, queryVariables } = this.props;
    const { title, phaseDone, taskUsed } = this.state;

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
        <label htmlFor="taskUsed">TaskUsed: </label>
        <input
          id="taskUsed"
          type="checkbox"
          checked={taskUsed}
          onChange={this.handleTaskDoneChange}
        />
        {phases &&
          phases.map(
            phase =>
              phase && (
                <PhaseItemWrapper key={phase.id}>
                  <PhaseItem
                    phase={phase}
                    projects={projects}
                    queryVariables={queryVariables}
                  />
                </PhaseItemWrapper>
              ),
          )}
        <input type="text" value={title} onChange={this.handleTitleChange} />
        <Button onClick={this.handleCreatePhaseClick}>Add</Button>
      </div>
    );
  }
}

const withData = compose(
  graphql<Data, OwnProps, Props>(phasePageQuery, {
    options: ({ match }) => ({
      variables: {
        phaseDone: false,
        taskUsed: false,
        groupId: match.params.groupId,
        projectId: match.params.projectId,
      },
      fetchPolicy: 'network-only',
    }),
    props: ({ data, ownProps: { match } }) => ({
      ...data,
      queryVariables: {
        phaseDone: false,
        taskUsed: false,
        groupId: match.params.groupId,
        projectId: match.params.projectId,
      },
      isLogin: data && data.currentUser,
    }),
  }),
  graphql<Data, OwnProps, Props>(CreatePhaseMutation.mutation, {
    props: ({ mutate, ownProps: { queryVariables } }) => ({
      createPhase: (title: string) =>
        mutate &&
        mutate(
          CreatePhaseMutation.buildMutationOptions({ title }, queryVariables),
        ),
    }),
  }),
);

export default withData(PhasePage);
