import * as React from 'react';
import styled from 'styled-components';
import { graphql, compose, QueryProps, ChildProps } from 'react-apollo';
import { PhaseItem_phaseFragment } from 'schema';
import Icon from '../components/Icon';
import TitleInput from '../components/TitleInput';
import * as CreateTaskMutation from '../../graphql/mutations/CreateTaskMutation';
import * as RemovePhaseMutation from '../../graphql/mutations/RemovePhaseMutation';
import * as UpdatePhaseMutation from '../../graphql/mutations/UpdatePhaseMutation';
import * as SetProjectToPhaseMutation from '../../graphql/mutations/SetProjectToPhaseMutation';
import TitlePlaceholder from '../components/TitlePlaceholder';
import DoneCheckbox from '../components/DoneCheckbox';
import TaskItem from './TaskItem';

const Wrapper = styled.div`margin: 2.5rem;`;

interface OwnProps {
  phase: PhaseItem_phaseFragment;
}

type Props = OwnProps & {
  createTask(title: string): void;
  removePhase: React.MouseEventHandler<HTMLElement>;
  updateTitle(_: { title: string }): void;
  toggleDone(): void;
  setProject(_: any): void;
};

export function PhaseItem({
  phase,
  removePhase,
  updateTitle,
  toggleDone,
  setProject,
}: Props) {
  const projectTitle = phase.project && phase.project.title;

  return (
    <div>
      <Wrapper>
        <DoneCheckbox done={phase.done} onChange={toggleDone} />
        <TitleInput title={phase.title} onChange={updateTitle} />
        {' ('}
        <TitlePlaceholder
          label={projectTitle}
          defaultLabel="No Project"
          onClick={setProject}
        />
        {') '}
        <Icon icon="trash" onClick={removePhase} />
      </Wrapper>
      {phase.tasks.map(task =>
        <TaskItem key={task.id} task={task} phaseId={phase.id} />,
      )}
    </div>
  );
}

const withData = compose(
  graphql<Response, OwnProps, Props>(CreateTaskMutation.mutation, {
    props: ({ mutate, ownProps: { phase } }) => ({
      createTask: (title: string) =>
        mutate(
          CreateTaskMutation.buildMutationOptions(
            { title },
            { done: false },
            { phaseId: phase.id },
          ),
        ),
    }),
  }),
  graphql<Response, OwnProps, Props>(RemovePhaseMutation.mutation, {
    props: ({ mutate, ownProps: { phase } }) => ({
      removePhase: () =>
        mutate(
          RemovePhaseMutation.buildMutationOptions(
            { phaseId: phase.id },
            { done: false },
          ),
        ),
    }),
  }),
  graphql<Response, OwnProps, Props>(UpdatePhaseMutation.mutation, {
    props: ({ mutate, ownProps: { phase } }) => ({
      updateTitle: (input: { title: string }) =>
        mutate(
          UpdatePhaseMutation.buildMutationOptions(
            { ...input, phaseId: phase.id },
            { done: false },
            phase,
          ),
        ),
      toggleDone: () =>
        mutate(
          UpdatePhaseMutation.buildMutationOptions(
            { done: !phase.done, phaseId: phase.id },
            { done: false },
            phase,
          ),
        ),
    }),
  }),
  graphql<Response, OwnProps, Props>(SetProjectToPhaseMutation.mutation, {
    props: ({ mutate, ownProps: { phase } }) => ({
      // TODO: Pass projectId
      setProject: (projectId: string) =>
        mutate(
          SetProjectToPhaseMutation.buildMutationOptions(
            { phaseId: phase.id, projectId: '' },
            { done: false },
          ),
        ),
    }),
  }),
);

export default withData(PhaseItem);
