import * as React from 'react';
import { graphql, compose, QueryProps, ChildProps } from 'react-apollo';
import { RouteComponentProps } from 'react-router-dom';
import {
  PhasePageQuery,
  PhasePageQueryVariables,
  PhaseItem_phaseFragment,
  PhaseTaskItem_taskFragment,
} from 'schema';
import * as PHASE_PAGE_QUERY from '../querySchema/PhasePage.graphql';
import { CreatePhase } from '../mutations';
import { styled } from '../../shared/styles';
import { Button, TitleInput } from '../../shared/components';
import PhaseItem from './PhaseItem';

const Wrapper = styled.div`font-size: 1.6rem;`;

const PhaseItemWrapper = styled.div`margin: 1.6rem 0;`;

const TitleInputWrapper = styled.div`margin: 1.6rem 0.8rem;`;

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
  phaseDone: boolean;
  taskUsed: boolean;
}

export class PhasePage extends React.Component<
  ChildProps<Props, Response>,
  State
> {
  state = { phaseDone: false, taskUsed: false };

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
    const {
      isLogin,
      phases,
      projects,
      createPhase,
      queryVariables,
    } = this.props;
    const { phaseDone, taskUsed } = this.state;

    if (!isLogin) {
      return <span>Loading...</span>;
    }

    return (
      <Wrapper>
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
        <TitleInputWrapper>
          <TitleInput
            defaultLabel="New Phase"
            title=""
            fullWidth
            onChange={createPhase}
          />
        </TitleInputWrapper>
      </Wrapper>
    );
  }
}

const withData = compose(
  graphql<Data, OwnProps, Props>(PHASE_PAGE_QUERY, {
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
  graphql<Data, OwnProps, Props>(CreatePhase.mutation, {
    props: ({ mutate, ownProps: { queryVariables } }) => ({
      createPhase: (title: string) =>
        mutate && mutate(CreatePhase.build({ title }, queryVariables)),
    }),
  }),
);

export default withData(PhasePage);
